/**
 * 文件操作相关 Actions (复制、移动、重命名、删除、更新描述)
 */

import { z } from 'zod';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import { file, fileZodSchemas } from '@qiyu-allinai/db/entities/knowledge';
import {
  copyFile,
  moveFile,
  generateStorageKey,
} from './s3Client';
import { assertResourcePermission, checkResourcePermission } from './utils';
import { folder } from '@qiyu-allinai/db/entities/knowledge';

type FileSelect = typeof file.$inferSelect;
type FileInsert = typeof file.$inferInsert;

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
    const { db } = context;
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    // 检查源文件读取权限
    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'read');

    // 如果目标文件夹不是自己的，需要检查目标文件夹写入权限
    if (input.targetFolderId) {
      const [targetFolder] = await db.select().from(folder)
        .where(and(eq(folder.id, input.targetFolderId), isNull(folder.deletedAt)))
        .limit(1);
      if (targetFolder && targetFolder.createdById !== context.currentUserId) {
        await assertResourcePermission(db, context.currentUserId, 'folder', targetFolder, 'write');
      }
    }

    const newStorageKey = generateStorageKey(context.currentUserId, input.targetFolderId, fileRecord.originalName);
    const copyResult = await copyFile(fileRecord.storageKey, newStorageKey, fileRecord.bucket);

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
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
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
    const { db } = context;
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    // 检查源文件读取权限
    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'read');

    const targetFolderId = input.targetFolderId;

    // 如果目标文件夹不是自己的，需要检查目标文件夹写入权限
    if (targetFolderId) {
      const [targetFolder] = await db.select().from(folder)
        .where(and(eq(folder.id, targetFolderId), isNull(folder.deletedAt)))
        .limit(1);
      if (targetFolder && targetFolder.createdById !== context.currentUserId) {
        await assertResourcePermission(db, context.currentUserId, 'folder', targetFolder, 'write');
      }
    }

    const baseName = fileRecord.name.replace(/\.[^.]+$/, '');
    const ext = fileRecord.extension || '';
    const extension = ext ? '.' + ext : '';
    
    const folderCondition = targetFolderId === null 
      ? isNull(file.folderId) 
      : eq(file.folderId, targetFolderId);
    
    const existingFiles = await db.select({ name: file.name })
      .from(file)
      .where(and(folderCondition, isNull(file.deletedAt)));
    
    const existingNames = new Set(existingFiles.map(f => f.name));
    
    let newName = fileRecord.name;
    let copyNum = 1;
    
    while (existingNames.has(newName)) {
      newName = `${baseName}(${copyNum})${extension}`;
      copyNum++;
    }

    const newStorageKey = generateStorageKey(context.currentUserId, targetFolderId, newName);
    const copyResult = await copyFile(fileRecord.storageKey, newStorageKey, fileRecord.bucket);

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
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
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
    const { db } = context;
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    // 检查源文件写入权限（移动需要写入权限）
    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'write');

    // 如果目标文件夹不是自己的，需要检查目标文件夹写入权限
    if (input.targetFolderId) {
      const [targetFolder] = await db.select().from(folder)
        .where(and(eq(folder.id, input.targetFolderId), isNull(folder.deletedAt)))
        .limit(1);
      if (targetFolder && targetFolder.createdById !== context.currentUserId) {
        await assertResourcePermission(db, context.currentUserId, 'folder', targetFolder, 'write');
      }
    }

    const newStorageKey = generateStorageKey(context.currentUserId, input.targetFolderId, fileRecord.originalName);
    const moveResult = await moveFile(fileRecord.storageKey, newStorageKey, fileRecord.bucket);

    const [result] = await db.update(file)
      .set({
        folderId: input.targetFolderId,
        storageKey: newStorageKey,
        etag: moveResult.etag,
        versionId: moveResult.versionId,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
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
    const { db } = context;
    
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'write');

    const ext = input.name.split('.').pop() || '';

    const [result] = await db.update(file)
      .set({
        name: input.name,
        originalName: input.name,
        extension: ext,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(file.id, input.id))
      .returning();

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
    const { db } = context;
    
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      return false;
    }

    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'delete');

    await db.update(file)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(eq(file.id, input.id));

    return true;
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
    const { db } = context;
    
    const files = await db.select().from(file)
      .where(and(inArray(file.id, input.ids), isNull(file.deletedAt)));

    const allowedIds: string[] = [];
    for (const f of files) {
      const allowed = await checkResourcePermission(db, context.currentUserId, 'file', f, 'delete');
      if (allowed) {
        allowedIds.push(f.id);
      }
    }

    if (allowedIds.length === 0) {
      return 0;
    }

    const results = await db.update(file)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(inArray(file.id, allowedIds))
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
    const { db } = context;
    
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'write');

    const [result] = await db.update(file)
      .set({
        description: input.description,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .returning();

    if (!result) {
      throw ActionError.notFound('error.files.notFound');
    }

    return result as FileSelect;
  },
});

export const fileOperationsActions = [
  fileCopy,
  fileCopyAsDuplicate,
  fileMove,
  fileRename,
  fileDelete,
  fileDeleteMany,
  fileUpdateDescription,
];
