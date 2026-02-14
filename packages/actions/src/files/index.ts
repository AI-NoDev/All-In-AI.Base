import { z } from 'zod';
import { eq, and, isNull, inArray, like } from 'drizzle-orm';
import { defineAction } from '../core/define';
import db from '@qiyu-allinai/db/connect';
import { file, fileZodSchemas, folder, folderZodSchemas, fileVersion } from '@qiyu-allinai/db/entities/knowledge';
import {
  uploadFile,
  getFile,
  getFileAsString,
  deleteFile,
  copyFile,
  moveFile,
  getPresignedUploadUrl,
  getPresignedDownloadUrl,
  generateStorageKey,
  DEFAULT_BUCKET,
} from './s3Client';
import { filePermissionActions } from './filePermission';

type FileSelect = typeof file.$inferSelect;
type FileInsert = typeof file.$inferInsert;
type FolderSelect = typeof folder.$inferSelect;
type FolderInsert = typeof folder.$inferInsert;
type FileVersionInsert = typeof fileVersion.$inferInsert;

// ============ 检查文件是否存在 ============
export const fileCheckExists = defineAction({
  meta: {
    name: 'files.checkExists',
    displayName: '检查文件是否存在',
    description: '检查指定文件夹中是否存在同名文件',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/check-exists',
  },
  schemas: {
    bodySchema: z.object({
      folderId: z.string().nullable().optional(),
      names: z.array(z.string().min(1).max(255)),
    }),
    outputSchema: z.object({
      exists: z.array(z.object({
        name: z.string(),
        fileId: z.string(),
        size: z.number(),
        updatedAt: z.string(),
      })),
    }),
  },
  execute: async (input, context) => {
    const folderId = input.folderId || null;
    
    // 构建文件夹条件
    const folderCondition = folderId === null 
      ? isNull(file.folderId) 
      : eq(file.folderId, folderId);
    
    // 查询已存在的文件（未删除的）
    const existingFiles = await db.select({
      id: file.id,
      name: file.name,
      size: file.size,
      updatedAt: file.updatedAt,
    }).from(file)
      .where(and(
        folderCondition,
        isNull(file.deletedAt),
      ));
    
    // 过滤出匹配的文件名
    const nameSet = new Set(input.names);
    const matches = existingFiles.filter(f => nameSet.has(f.name));
    
    return {
      exists: matches.map(f => ({
        name: f.name,
        fileId: f.id,
        size: f.size,
        updatedAt: f.updatedAt,
      })),
    };
  },
});

// ============ 文件上传（普通模式） ============
export const fileUpload = defineAction({
  meta: {
    name: 'files.upload',
    displayName: '上传文件',
    description: '上传文件到存储（如果文件已存在则返回冲突信息）',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/upload',
  },
  schemas: {
    bodySchema: z.object({
      folderId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      content: z.string(), // base64 encoded
      mimeType: z.string().optional(),
      description: z.string().optional(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      file: fileZodSchemas.select.optional(),
      conflict: z.object({
        fileId: z.string(),
        name: z.string(),
        size: z.number(),
        updatedAt: z.string(),
      }).optional(),
    }),
  },
  execute: async (input, context) => {
    const folderId = input.folderId || null;
    
    // 检查文件是否已存在
    const folderCondition = folderId === null 
      ? isNull(file.folderId) 
      : eq(file.folderId, folderId);
    
    const [existingFile] = await db.select().from(file)
      .where(and(
        folderCondition,
        eq(file.name, input.name),
        isNull(file.deletedAt),
      ))
      .limit(1);
    
    if (existingFile) {
      // 文件已存在，返回冲突信息
      return {
        success: false,
        conflict: {
          fileId: existingFile.id,
          name: existingFile.name,
          size: existingFile.size,
          updatedAt: existingFile.updatedAt,
        },
      };
    }
    
    // 文件不存在，正常上传
    const buffer = Buffer.from(input.content, 'base64');
    const ext = input.name.split('.').pop() || '';
    const mimeType = input.mimeType || 'application/octet-stream';
    const storageKey = generateStorageKey(context.currentUserId, folderId, input.name);

    // 上传到 S3
    const uploadResult = await uploadFile(storageKey, buffer, mimeType);

    // 创建文件记录
    const [result] = await db.insert(file).values({
      folderId,
      name: input.name,
      originalName: input.name,
      extension: ext,
      mimeType,
      size: buffer.length,
      storageKey,
      bucket: uploadResult.bucket,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
      description: input.description,
      createdBy: context.currentUserName,
      updatedBy: context.currentUserName,
    } as FileInsert).returning();

    return {
      success: true,
      file: result as FileSelect,
    };
  },
});

// ============ 文件上传（强制模式，支持冲突处理） ============
export const fileUploadForce = defineAction({
  meta: {
    name: 'files.uploadForce',
    displayName: '强制上传文件',
    description: '上传文件并处理冲突（覆盖/创建新版本/创建副本）',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/upload-force',
  },
  schemas: {
    bodySchema: z.object({
      folderId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      content: z.string(), // base64 encoded
      mimeType: z.string().optional(),
      description: z.string().optional(),
      conflictMode: z.enum(['overwrite', 'newVersion', 'copy']),
      existingFileId: z.string().optional(), // 已存在文件的ID（用于覆盖和新版本）
    }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const folderId = input.folderId || null;
    const buffer = Buffer.from(input.content, 'base64');
    const ext = input.name.split('.').pop() || '';
    const mimeType = input.mimeType || 'application/octet-stream';
    
    // 根据冲突模式处理
    if (input.conflictMode === 'overwrite') {
      // 覆盖模式：软删除旧文件，上传新文件
      if (input.existingFileId) {
        await db.update(file)
          .set({
            deletedAt: new Date().toISOString(),
            deletedById: context.currentUserId,
            deletedBy: context.currentUserName,
          })
          .where(eq(file.id, input.existingFileId));
      }
      
      const storageKey = generateStorageKey(context.currentUserId, folderId, input.name);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.insert(file).values({
        folderId,
        name: input.name,
        originalName: input.name,
        extension: ext,
        mimeType,
        size: buffer.length,
        storageKey,
        bucket: uploadResult.bucket,
        etag: uploadResult.etag,
        versionId: uploadResult.versionId,
        description: input.description,
        createdBy: context.currentUserName,
        updatedBy: context.currentUserName,
      } as FileInsert).returning();
      
      return result as FileSelect;
      
    } else if (input.conflictMode === 'newVersion') {
      // 新版本模式：创建版本记录，更新主文件
      if (!input.existingFileId) {
        throw new Error('error.files.existingFileIdRequired');
      }
      
      // 获取现有文件
      const [existingFile] = await db.select().from(file)
        .where(and(eq(file.id, input.existingFileId), isNull(file.deletedAt)))
        .limit(1);
      
      if (!existingFile) {
        throw new Error('error.files.notFound');
      }
      
      // 计算新版本号
      const existingVersions = await db.select({ versionNumber: fileVersion.versionNumber })
        .from(fileVersion)
        .where(eq(fileVersion.fileId, input.existingFileId));
      
      let maxVersion = 0;
      for (const v of existingVersions) {
        const num = parseInt(v.versionNumber.replace('v', ''), 10);
        if (!isNaN(num) && num > maxVersion) maxVersion = num;
      }
      const newVersionNumber = `v${maxVersion + 1}`;
      
      // 保存当前版本到版本历史
      await db.insert(fileVersion).values({
        fileId: existingFile.id,
        versionNumber: maxVersion === 0 ? 'v1' : `v${maxVersion}`,
        storageKey: existingFile.storageKey,
        bucket: existingFile.bucket,
        s3VersionId: existingFile.versionId,
        etag: existingFile.etag,
        size: existingFile.size,
        createdById: context.currentUserId,
        createdBy: context.currentUserName,
      } as FileVersionInsert);
      
      // 上传新文件到 S3
      const storageKey = generateStorageKey(context.currentUserId, folderId, input.name);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      // 更新主文件记录，并增加版本计数
      const [result] = await db.update(file)
        .set({
          storageKey,
          bucket: uploadResult.bucket,
          etag: uploadResult.etag,
          versionId: uploadResult.versionId,
          size: buffer.length,
          mimeType,
          versionCount: (existingFile.versionCount || 0) + 1,
          updatedBy: context.currentUserName,
        })
        .where(eq(file.id, input.existingFileId))
        .returning();
      
      return result as FileSelect;
      
    } else if (input.conflictMode === 'copy') {
      // 副本模式：创建新文件，文件名添加序号 baseName(num).ext
      const baseName = input.name.replace(/\.[^.]+$/, '');
      const extension = input.name.includes('.') ? '.' + ext : '';
      
      // 构建文件夹条件
      const folderCondition = folderId === null 
        ? isNull(file.folderId) 
        : eq(file.folderId, folderId);
      
      // 查找所有文件
      const existingFiles = await db.select({ name: file.name })
        .from(file)
        .where(and(
          folderCondition,
          isNull(file.deletedAt),
        ));
      
      // 找出最大的副本序号
      let maxCopyNum = 0;
      // 匹配格式: baseName(n).ext 或 baseName.ext
      const escapedBaseName = escapeRegExp(baseName);
      const escapedExtension = escapeRegExp(extension);
      const copyPattern = new RegExp(`^${escapedBaseName}(?:\\((\\d+)\\))?${escapedExtension}$`);
      
      for (const f of existingFiles) {
        const match = f.name.match(copyPattern);
        if (match) {
          const num = match[1] ? parseInt(match[1], 10) : 0;
          if (num > maxCopyNum) maxCopyNum = num;
          if (num === 0 && f.name === input.name) maxCopyNum = Math.max(maxCopyNum, 0);
        }
      }
      
      // 生成新文件名: baseName(num).ext
      const newName = `${baseName}(${maxCopyNum + 1})${extension}`;
      
      const storageKey = generateStorageKey(context.currentUserId, folderId, newName);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.insert(file).values({
        folderId,
        name: newName,
        originalName: input.name,
        extension: ext,
        mimeType,
        size: buffer.length,
        storageKey,
        bucket: uploadResult.bucket,
        etag: uploadResult.etag,
        versionId: uploadResult.versionId,
        description: input.description,
        createdBy: context.currentUserName,
        updatedBy: context.currentUserName,
      } as FileInsert).returning();
      
      return result as FileSelect;
    }
    
    throw new Error('error.files.invalidConflictMode');
  },
});

// Helper function to escape special regex characters
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// ============ 获取预签名上传 URL ============
export const fileGetUploadUrl = defineAction({
  meta: {
    name: 'files.getUploadUrl',
    displayName: '获取上传URL',
    description: '获取预签名上传URL',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/upload-url',
  },
  schemas: {
    bodySchema: z.object({
      folderId: z.string().nullable().optional(),
      filename: z.string().min(1).max(255),
      mimeType: z.string(),
    }),
    outputSchema: z.object({
      uploadUrl: z.string(),
      storageKey: z.string(),
      expiresAt: z.string(),
    }),
  },
  execute: async (input, context) => {
    const storageKey = generateStorageKey(context.currentUserId, input.folderId || null, input.filename);
    const { url, expiresAt } = await getPresignedUploadUrl(storageKey, input.mimeType);

    return {
      uploadUrl: url,
      storageKey,
      expiresAt: expiresAt.toISOString(),
    };
  },
});

// ============ 确认上传完成 ============
export const fileConfirmUpload = defineAction({
  meta: {
    name: 'files.confirmUpload',
    displayName: '确认上传',
    description: '确认文件上传完成并创建记录',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/confirm-upload',
  },
  schemas: {
    bodySchema: z.object({
      folderId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      storageKey: z.string(),
      mimeType: z.string(),
      size: z.number(),
      description: z.string().optional(),
    }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const ext = input.name.split('.').pop() || '';

    const [result] = await db.insert(file).values({
      folderId: input.folderId || null,
      name: input.name,
      originalName: input.name,
      extension: ext,
      mimeType: input.mimeType,
      size: input.size,
      storageKey: input.storageKey,
      bucket: DEFAULT_BUCKET,
      description: input.description,
      createdBy: context.currentUserName,
      updatedBy: context.currentUserName,
    } as FileInsert).returning();

    return result as FileSelect;
  },
});


// ============ 获取下载 URL ============
export const fileGetDownloadUrl = defineAction({
  meta: {
    name: 'files.getDownloadUrl',
    displayName: '获取下载URL',
    description: '获取预签名下载URL',
    tags: ['files', 'files'],
    method: 'GET',
    path: '/api/files/:id/download-url',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({
      url: z.string(),
      expiresAt: z.string(),
    }),
  },
  execute: async (input, _context) => {
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    const { url, expiresAt } = await getPresignedDownloadUrl(
      fileRecord.storageKey,
      fileRecord.bucket,
      3600,
      fileRecord.originalName
    );

    // 更新下载次数
    await db.update(file)
      .set({ downloadCount: (fileRecord.downloadCount || 0) + 1 })
      .where(eq(file.id, input.id));

    return {
      url,
      expiresAt: expiresAt.toISOString(),
    };
  },
});

// 允许编辑的文本文件扩展名
const TEXT_FILE_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'json', 'js', 'ts', 'jsx', 'tsx',
  'html', 'htm', 'css', 'scss', 'sass', 'less',
  'xml', 'yaml', 'yml', 'toml', 'ini', 'conf', 'cfg',
  'sh', 'bash', 'zsh', 'fish', 'bat', 'cmd', 'ps1',
  'py', 'rb', 'php', 'java', 'c', 'cpp', 'h', 'hpp',
  'go', 'rs', 'swift', 'kt', 'scala', 'clj',
  'sql', 'graphql', 'gql',
  'env', 'gitignore', 'dockerignore', 'editorconfig',
  'log', 'csv', 'tsv',
]);

// 允许编辑的 MIME 类型前缀
const TEXT_MIME_PREFIXES = ['text/', 'application/json', 'application/xml', 'application/javascript'];

function isTextFile(extension: string | null, mimeType: string | null): boolean {
  // 检查扩展名
  if (extension && TEXT_FILE_EXTENSIONS.has(extension.toLowerCase())) {
    return true;
  }
  // 检查 MIME 类型
  if (mimeType) {
    for (const prefix of TEXT_MIME_PREFIXES) {
      if (mimeType.startsWith(prefix)) {
        return true;
      }
    }
  }
  return false;
}

// ============ 获取文本文件内容（带验证） ============
export const fileGetTextContent = defineAction({
  meta: {
    name: 'files.getTextContent',
    displayName: '获取文本文件内容',
    description: '获取文本文件内容，仅支持纯文本文件',
    tags: ['files', 'files'],
    method: 'GET',
    path: '/api/files/:id/text-content',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({
      id: z.string(),
      name: z.string(),
      content: z.string(),
      mimeType: z.string().nullable(),
      extension: z.string().nullable(),
      folderId: z.string().nullable(),
    }),
  },
  execute: async (input, _context) => {
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    // 验证是否为文本文件
    if (!isTextFile(fileRecord.extension, fileRecord.mimeType)) {
      throw new Error('error.files.notTextFile');
    }

    const content = await getFileAsString(fileRecord.storageKey, fileRecord.bucket);

    return {
      id: fileRecord.id,
      name: fileRecord.name,
      content,
      mimeType: fileRecord.mimeType,
      extension: fileRecord.extension,
      folderId: fileRecord.folderId,
    };
  },
});

// ============ 获取文本文件内容 ============
export const fileGetContent = defineAction({
  meta: {
    name: 'files.getContent',
    displayName: '获取文件内容',
    description: '获取文本文件内容',
    tags: ['files', 'files'],
    method: 'GET',
    path: '/api/files/:id/content',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({
      content: z.string(),
      mimeType: z.string().nullable(),
    }),
  },
  execute: async (input, _context) => {
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    const content = await getFileAsString(fileRecord.storageKey, fileRecord.bucket);

    return {
      content,
      mimeType: fileRecord.mimeType,
    };
  },
});


// ============ 保存文本文件内容 ============
export const fileSaveContent = defineAction({
  meta: {
    name: 'files.saveContent',
    displayName: '保存文件内容',
    description: '保存文本文件内容',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/:id/content',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ content: z.string() }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    const buffer = Buffer.from(input.content, 'utf-8');
    
    // 上传新内容到 S3
    await uploadFile(fileRecord.storageKey, buffer, fileRecord.mimeType || 'text/plain', fileRecord.bucket);

    // 更新文件大小
    const [result] = await db.update(file)
      .set({
        size: buffer.length,
        updatedBy: context.currentUserName,
      })
      .where(eq(file.id, input.id))
      .returning();

    return result as FileSelect;
  },
});

// ============ 复制文件 ============
export const fileCopy = defineAction({
  meta: {
    name: 'files.copy',
    displayName: '复制文件',
    description: '复制文件到目标文件夹',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/:id/copy',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ targetFolderId: z.string().nullable() }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    // 生成新的存储 key
    const newStorageKey = generateStorageKey(context.currentUserId, input.targetFolderId, fileRecord.originalName);

    // 复制 S3 文件
    const copyResult = await copyFile(fileRecord.storageKey, newStorageKey, fileRecord.bucket);

    // 创建新文件记录
    const [result] = await db.insert(file).values({
      folderId: input.targetFolderId,
      name: fileRecord.name,
      originalName: fileRecord.originalName,
      extension: fileRecord.extension,
      mimeType: fileRecord.mimeType,
      size: fileRecord.size,
      storageKey: newStorageKey,
      bucket: copyResult.bucket,
      etag: copyResult.etag,
      versionId: copyResult.versionId,
      description: fileRecord.description,
      tags: fileRecord.tags,
      createdBy: context.currentUserName,
      updatedBy: context.currentUserName,
    } as FileInsert).returning();

    return result as FileSelect;
  },
});


// ============ 复制文件为副本（自动处理文件名冲突） ============
export const fileCopyAsDuplicate = defineAction({
  meta: {
    name: 'files.copyAsDuplicate',
    displayName: '复制文件为副本',
    description: '复制文件到目标文件夹，自动生成唯一文件名 filename(num).ext',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/:id/copy-as-duplicate',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ targetFolderId: z.string().nullable() }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    const targetFolderId = input.targetFolderId;
    
    // 解析文件名
    const baseName = fileRecord.name.replace(/\.[^.]+$/, '');
    const ext = fileRecord.extension || '';
    const extension = ext ? '.' + ext : '';
    
    // 构建文件夹条件
    const folderCondition = targetFolderId === null 
      ? isNull(file.folderId) 
      : eq(file.folderId, targetFolderId);
    
    // 查找目标文件夹中所有文件
    const existingFiles = await db.select({ name: file.name })
      .from(file)
      .where(and(
        folderCondition,
        isNull(file.deletedAt),
      ));
    
    // 创建已存在文件名的 Set
    const existingNames = new Set(existingFiles.map(f => f.name));
    
    // 生成唯一文件名: 从 filename(1).ext 开始尝试，直到找到不存在的
    let newName = fileRecord.name;
    let copyNum = 1;
    
    // 如果原文件名已存在，需要加序号
    while (existingNames.has(newName)) {
      newName = `${baseName}(${copyNum})${extension}`;
      copyNum++;
    }

    // 生成新的存储 key
    const newStorageKey = generateStorageKey(context.currentUserId, targetFolderId, newName);

    // 复制 S3 文件
    const copyResult = await copyFile(fileRecord.storageKey, newStorageKey, fileRecord.bucket);

    // 创建新文件记录
    const [result] = await db.insert(file).values({
      folderId: targetFolderId,
      name: newName,
      originalName: fileRecord.originalName,
      extension: fileRecord.extension,
      mimeType: fileRecord.mimeType,
      size: fileRecord.size,
      storageKey: newStorageKey,
      bucket: copyResult.bucket,
      etag: copyResult.etag,
      versionId: copyResult.versionId,
      description: fileRecord.description,
      tags: fileRecord.tags,
      createdBy: context.currentUserName,
      updatedBy: context.currentUserName,
    } as FileInsert).returning();

    return result as FileSelect;
  },
});


// ============ 移动文件 ============
export const fileMove = defineAction({
  meta: {
    name: 'files.move',
    displayName: '移动文件',
    description: '移动文件到目标文件夹',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/:id/move',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ targetFolderId: z.string().nullable() }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    // 生成新的存储 key
    const newStorageKey = generateStorageKey(context.currentUserId, input.targetFolderId, fileRecord.originalName);

    // 移动 S3 文件
    const moveResult = await moveFile(fileRecord.storageKey, newStorageKey, fileRecord.bucket);

    // 更新文件记录
    const [result] = await db.update(file)
      .set({
        folderId: input.targetFolderId,
        storageKey: newStorageKey,
        etag: moveResult.etag,
        versionId: moveResult.versionId,
        updatedBy: context.currentUserName,
      })
      .where(eq(file.id, input.id))
      .returning();

    return result as FileSelect;
  },
});

// ============ 重命名文件 ============
export const fileRename = defineAction({
  meta: {
    name: 'files.rename',
    displayName: '重命名文件',
    description: '重命名文件',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/:id/rename',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ name: z.string().min(1).max(255) }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const ext = input.name.split('.').pop() || '';

    const [result] = await db.update(file)
      .set({
        name: input.name,
        originalName: input.name,
        extension: ext,
        updatedBy: context.currentUserName,
      })
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .returning();

    if (!result) {
      throw new Error('error.files.notFound');
    }

    return result as FileSelect;
  },
});

// ============ 删除文件 ============
export const fileDelete = defineAction({
  meta: {
    name: 'files.delete',
    displayName: '删除文件',
    description: '软删除文件',
    tags: ['files', 'files'],
    method: 'DELETE',
    path: '/api/files/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const [result] = await db.update(file)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .returning();

    return !!result;
  },
});


// ============ 批量删除文件 ============
export const fileDeleteMany = defineAction({
  meta: {
    name: 'files.deleteMany',
    displayName: '批量删除文件',
    description: '批量软删除文件',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/delete-batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()) }),
    outputSchema: z.number(),
  },
  execute: async (input, context) => {
    const results = await db.update(file)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(inArray(file.id, input.ids), isNull(file.deletedAt)))
      .returning();

    return results.length;
  },
});

// ============ 更新文件描述 ============
export const fileUpdateDescription = defineAction({
  meta: {
    name: 'files.updateDescription',
    displayName: '更新文件描述',
    description: '更新文件描述信息',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/:id/description',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ description: z.string().nullable() }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const [result] = await db.update(file)
      .set({
        description: input.description,
        updatedBy: context.currentUserName,
      })
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .returning();

    if (!result) {
      throw new Error('error.files.notFound');
    }

    return result as FileSelect;
  },
});

// ============ 创建文件夹 ============
export const filesFolderCreate = defineAction({
  meta: {
    name: 'files.folderCreate',
    displayName: '创建文件夹',
    description: '创建新文件夹',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/folders',
  },
  schemas: {
    bodySchema: z.object({
      parentId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
    }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    // 构建路径
    let path = '/';
    if (input.parentId) {
      const [parent] = await db.select().from(folder)
        .where(and(eq(folder.id, input.parentId), isNull(folder.deletedAt)))
        .limit(1);
      if (parent) {
        path = `${parent.path}${parent.name}/`;
      }
    }

    const [result] = await db.insert(folder).values({
      parentId: input.parentId || null,
      name: input.name,
      path,
      description: input.description,
      icon: input.icon,
      color: input.color,
      createdBy: context.currentUserName,
      updatedBy: context.currentUserName,
    } as FolderInsert).returning();

    return result as FolderSelect;
  },
});


// ============ 重命名文件夹 ============
export const filesFolderRename = defineAction({
  meta: {
    name: 'files.folderRename',
    displayName: '重命名文件夹',
    description: '重命名文件夹',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/folders/:id/rename',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ name: z.string().min(1).max(255) }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const [result] = await db.update(folder)
      .set({
        name: input.name,
        updatedBy: context.currentUserName,
      })
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .returning();

    if (!result) {
      throw new Error('error.files.folderNotFound');
    }

    return result as FolderSelect;
  },
});

// ============ 更新文件夹样式 ============
export const filesFolderUpdateStyle = defineAction({
  meta: {
    name: 'files.folderUpdateStyle',
    displayName: '更新文件夹样式',
    description: '更新文件夹图标和颜色',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/folders/:id/style',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({
      icon: z.string().nullable().optional(),
      color: z.string().nullable().optional(),
    }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const [result] = await db.update(folder)
      .set({
        icon: input.icon,
        color: input.color,
        updatedBy: context.currentUserName,
      })
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .returning();

    if (!result) {
      throw new Error('error.files.folderNotFound');
    }

    return result as FolderSelect;
  },
});

// ============ 更新文件夹描述 ============
export const filesFolderUpdateDescription = defineAction({
  meta: {
    name: 'files.folderUpdateDescription',
    displayName: '更新文件夹描述',
    description: '更新文件夹描述信息',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/folders/:id/description',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ description: z.string().nullable() }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const [result] = await db.update(folder)
      .set({
        description: input.description,
        updatedBy: context.currentUserName,
      })
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .returning();

    if (!result) {
      throw new Error('error.files.folderNotFound');
    }

    return result as FolderSelect;
  },
});

// ============ 更新文件夹排序 ============
export const filesFolderUpdateOrder = defineAction({
  meta: {
    name: 'files.folderUpdateOrder',
    displayName: '更新文件夹排序',
    description: '更新文件夹排序',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/folders/:id/order',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ orderNum: z.number().int() }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const [result] = await db.update(folder)
      .set({
        orderNum: input.orderNum,
        updatedBy: context.currentUserName,
      })
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .returning();

    if (!result) {
      throw new Error('error.files.folderNotFound');
    }

    return result as FolderSelect;
  },
});


// ============ 删除文件夹 ============
export const filesFolderDelete = defineAction({
  meta: {
    name: 'files.folderDelete',
    displayName: '删除文件夹',
    description: '软删除文件夹及其内容',
    tags: ['files', 'files'],
    method: 'DELETE',
    path: '/api/files/folders/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const now = new Date().toISOString();

    // 删除文件夹
    const [result] = await db.update(folder)
      .set({
        deletedAt: now,
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .returning();

    if (!result) {
      return false;
    }

    // 删除文件夹内的文件
    await db.update(file)
      .set({
        deletedAt: now,
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(eq(file.folderId, input.id), isNull(file.deletedAt)));

    // 递归删除子文件夹
    const subFolders = await db.select().from(folder)
      .where(and(eq(folder.parentId, input.id), isNull(folder.deletedAt)));

    for (const subFolder of subFolders) {
      await db.update(folder)
        .set({
          deletedAt: now,
          deletedById: context.currentUserId,
          deletedBy: context.currentUserName,
        })
        .where(eq(folder.id, subFolder.id));

      await db.update(file)
        .set({
          deletedAt: now,
          deletedById: context.currentUserId,
          deletedBy: context.currentUserName,
        })
        .where(and(eq(file.folderId, subFolder.id), isNull(file.deletedAt)));
    }

    return true;
  },
});

// ============ 移动文件夹 ============
export const filesFolderMove = defineAction({
  meta: {
    name: 'files.folderMove',
    displayName: '移动文件夹',
    description: '移动文件夹到目标位置',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/folders/:id/move',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ targetParentId: z.string().nullable() }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    // 不能移动到自己或子文件夹
    if (input.targetParentId === input.id) {
      throw new Error('error.files.cannotMoveToSelf');
    }

    // 构建新路径
    let newPath = '/';
    if (input.targetParentId) {
      const [parent] = await db.select().from(folder)
        .where(and(eq(folder.id, input.targetParentId), isNull(folder.deletedAt)))
        .limit(1);
      if (parent) {
        newPath = `${parent.path}${parent.name}/`;
      }
    }

    const [result] = await db.update(folder)
      .set({
        parentId: input.targetParentId,
        path: newPath,
        updatedBy: context.currentUserName,
      })
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .returning();

    if (!result) {
      throw new Error('error.files.folderNotFound');
    }

    return result as FolderSelect;
  },
});

// ============ 下载历史版本 ============
export const fileVersionDownload = defineAction({
  meta: {
    name: 'files.versionDownload',
    displayName: '下载历史版本',
    description: '获取历史版本的下载URL',
    tags: ['files', 'files'],
    method: 'GET',
    path: '/api/files/versions/:id/download-url',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({
      url: z.string(),
      expiresAt: z.string(),
    }),
  },
  execute: async (input, _context) => {
    // 获取版本记录
    const [versionRecord] = await db.select().from(fileVersion)
      .where(eq(fileVersion.id, input.id))
      .limit(1);

    if (!versionRecord) {
      throw new Error('error.files.versionNotFound');
    }

    // 获取主文件记录以获取文件名
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, versionRecord.fileId), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    // 生成下载文件名：原文件名_版本号.扩展名
    const baseName = fileRecord.originalName.replace(/\.[^.]+$/, '');
    const ext = fileRecord.extension ? `.${fileRecord.extension}` : '';
    const downloadName = `${baseName}_${versionRecord.versionNumber}${ext}`;

    const { url, expiresAt } = await getPresignedDownloadUrl(
      versionRecord.storageKey,
      versionRecord.bucket,
      3600,
      downloadName
    );

    return {
      url,
      expiresAt: expiresAt.toISOString(),
    };
  },
});

// ============ 恢复历史版本 ============
export const fileVersionRestore = defineAction({
  meta: {
    name: 'files.versionRestore',
    displayName: '恢复历史版本',
    description: '将历史版本恢复为当前版本（交换S3字段）',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/versions/:id/restore',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    // 获取版本记录
    const [versionRecord] = await db.select().from(fileVersion)
      .where(eq(fileVersion.id, input.id))
      .limit(1);

    if (!versionRecord) {
      throw new Error('error.files.versionNotFound');
    }

    // 获取主文件记录
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, versionRecord.fileId), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw new Error('error.files.notFound');
    }

    // 计算新版本号
    const existingVersions = await db.select({ versionNumber: fileVersion.versionNumber })
      .from(fileVersion)
      .where(eq(fileVersion.fileId, fileRecord.id));

    let maxVersion = 0;
    for (const v of existingVersions) {
      const num = parseInt(v.versionNumber.replace('v', ''), 10);
      if (!isNaN(num) && num > maxVersion) maxVersion = num;
    }
    const newVersionNumber = `v${maxVersion + 1}`;

    // 将当前文件保存为新版本
    await db.insert(fileVersion).values({
      fileId: fileRecord.id,
      versionNumber: newVersionNumber,
      storageKey: fileRecord.storageKey,
      bucket: fileRecord.bucket,
      s3VersionId: fileRecord.versionId,
      etag: fileRecord.etag,
      size: fileRecord.size,
      changeLog: `恢复到 ${versionRecord.versionNumber}`,
      createdById: context.currentUserId,
      createdBy: context.currentUserName,
    } as FileVersionInsert);

    // 将历史版本的S3字段更新到主文件
    const [result] = await db.update(file)
      .set({
        storageKey: versionRecord.storageKey,
        bucket: versionRecord.bucket,
        versionId: versionRecord.s3VersionId,
        etag: versionRecord.etag,
        size: versionRecord.size,
        versionCount: (fileRecord.versionCount || 0) + 1,
        updatedBy: context.currentUserName,
      })
      .where(eq(file.id, fileRecord.id))
      .returning();

    return result as FileSelect;
  },
});

import { fileShareActions } from './fileShare';

// ============ 导出所有 actions ============
export const filesActions = [
  fileCheckExists,
  fileUpload,
  fileUploadForce,
  fileGetUploadUrl,
  fileConfirmUpload,
  fileGetDownloadUrl,
  fileGetTextContent,
  fileGetContent,
  fileSaveContent,
  fileCopy,
  fileCopyAsDuplicate,
  fileMove,
  fileRename,
  fileDelete,
  fileDeleteMany,
  fileUpdateDescription,
  fileVersionDownload,
  fileVersionRestore,
  filesFolderCreate,
  filesFolderRename,
  filesFolderUpdateStyle,
  filesFolderUpdateDescription,
  filesFolderUpdateOrder,
  filesFolderDelete,
  filesFolderMove,
  // 文件权限
  ...filePermissionActions,
  // 文件共享
  ...fileShareActions,
];

// 导出文件权限 Actions
export { filePermissionActions } from './filePermission';

// 导出文件共享 Actions
export { fileShareActions } from './fileShare';
