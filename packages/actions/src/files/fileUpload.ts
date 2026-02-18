/**
 * 文件上传相关 Actions
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import { file, fileZodSchemas, fileVersion } from '@qiyu-allinai/db/entities/knowledge';
import {
  uploadFile,
  getPresignedUploadUrl,
  generateStorageKey,
  DEFAULT_BUCKET,
} from './s3Client';
import { escapeRegExp, assertResourcePermission } from './utils';

type FileSelect = typeof file.$inferSelect;
type FileInsert = typeof file.$inferInsert;
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
    const { db } = context;
    const folderId = input.folderId || null;
    
    const folderCondition = folderId === null 
      ? isNull(file.folderId) 
      : eq(file.folderId, folderId);
    
    const existingFiles = await db.select({
      id: file.id,
      name: file.name,
      size: file.size,
      updatedAt: file.updatedAt,
    }).from(file)
      .where(and(folderCondition, isNull(file.deletedAt)));
    
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
      content: z.string(),
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
    const { db } = context;
    const folderId = input.folderId || null;
    
    const folderCondition = folderId === null 
      ? isNull(file.folderId) 
      : eq(file.folderId, folderId);
    
    const [existingFile] = await db.select().from(file)
      .where(and(folderCondition, eq(file.name, input.name), isNull(file.deletedAt)))
      .limit(1);
    
    if (existingFile) {
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
    
    const buffer = Buffer.from(input.content, 'base64');
    const ext = input.name.split('.').pop() || '';
    const mimeType = input.mimeType || 'application/octet-stream';
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
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as FileInsert).returning();

    return { success: true, file: result as FileSelect };
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
      content: z.string(),
      mimeType: z.string().optional(),
      description: z.string().optional(),
      conflictMode: z.enum(['overwrite', 'newVersion', 'copy']),
      existingFileId: z.string().optional(),
    }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const folderId = input.folderId || null;
    const buffer = Buffer.from(input.content, 'base64');
    const ext = input.name.split('.').pop() || '';
    const mimeType = input.mimeType || 'application/octet-stream';
    
    if (input.conflictMode === 'overwrite') {
      if (!input.existingFileId) {
        throw ActionError.badRequest('error.files.existingFileIdRequired');
      }
      
      const [existingFile] = await db.select().from(file)
        .where(and(eq(file.id, input.existingFileId), isNull(file.deletedAt)))
        .limit(1);
      
      if (!existingFile) {
        throw ActionError.notFound('error.files.notFound');
      }

      // 检查文件写入权限
      await assertResourcePermission(db, context.currentUserId, 'file', existingFile, 'write');
      
      const storageKey = generateStorageKey(context.currentUserId, existingFile.folderId, input.name);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.update(file)
        .set({
          storageKey,
          bucket: uploadResult.bucket,
          etag: uploadResult.etag,
          versionId: uploadResult.versionId,
          size: buffer.length,
          mimeType,
          name: input.name,
          extension: ext,
          updatedBy: context.currentUserName,
          updatedById: context.currentUserId,
        })
        .where(eq(file.id, input.existingFileId))
        .returning();
      
      return result as FileSelect;
      
    } else if (input.conflictMode === 'newVersion') {
      if (!input.existingFileId) {
        throw ActionError.badRequest('error.files.existingFileIdRequired');
      }
      
      const [existingFile] = await db.select().from(file)
        .where(and(eq(file.id, input.existingFileId), isNull(file.deletedAt)))
        .limit(1);
      
      if (!existingFile) {
        throw ActionError.notFound('error.files.notFound');
      }

      // 检查文件写入权限
      await assertResourcePermission(db, context.currentUserId, 'file', existingFile, 'write');
      
      const existingVersions = await db.select({ versionNumber: fileVersion.versionNumber })
        .from(fileVersion)
        .where(eq(fileVersion.fileId, input.existingFileId));
      
      let maxVersion = 0;
      for (const v of existingVersions) {
        const num = parseInt(v.versionNumber.replace('v', ''), 10);
        if (!isNaN(num) && num > maxVersion) maxVersion = num;
      }
      
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
      
      const storageKey = generateStorageKey(context.currentUserId, folderId, input.name);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
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
          updatedById: context.currentUserId,
        })
        .where(eq(file.id, input.existingFileId))
        .returning();
      
      return result as FileSelect;
      
    } else if (input.conflictMode === 'copy') {
      const baseName = input.name.replace(/\.[^.]+$/, '');
      const extension = input.name.includes('.') ? '.' + ext : '';
      
      const folderCondition = folderId === null 
        ? isNull(file.folderId) 
        : eq(file.folderId, folderId);
      
      const existingFiles = await db.select({ name: file.name })
        .from(file)
        .where(and(folderCondition, isNull(file.deletedAt)));
      
      let maxCopyNum = 0;
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
        createdById: context.currentUserId,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      } as FileInsert).returning();
      
      return result as FileSelect;
    }
    
    throw ActionError.badRequest('error.files.invalidConflictMode');
  },
});

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
    const { db } = context;
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
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as FileInsert).returning();

    return result as FileSelect;
  },
});

export const fileUploadActions = [
  fileCheckExists,
  fileUpload,
  fileUploadForce,
  fileGetUploadUrl,
  fileConfirmUpload,
];
