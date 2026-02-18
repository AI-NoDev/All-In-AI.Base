/**
 * 文件内容读取/保存相关 Actions
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import { file, fileZodSchemas } from '@qiyu-allinai/db/entities/knowledge';
import {
  uploadFile,
  getFileAsString,
  getPresignedDownloadUrl,
} from './s3Client';
import { isTextFile, assertResourcePermission } from './utils';

type FileSelect = typeof file.$inferSelect;

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
  execute: async (input, context) => {
    const { db } = context;
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    // 权限检查
    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'read');

    const { url, expiresAt } = await getPresignedDownloadUrl(
      fileRecord.storageKey,
      fileRecord.bucket,
      3600,
      fileRecord.originalName
    );

    await db.update(file)
      .set({ downloadCount: (fileRecord.downloadCount || 0) + 1 })
      .where(eq(file.id, input.id));

    return {
      url,
      expiresAt: expiresAt.toISOString(),
    };
  },
});

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
  execute: async (input, context) => {
    const { db } = context;
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    // 权限检查
    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'read');

    if (!isTextFile(fileRecord.extension, fileRecord.mimeType)) {
      throw ActionError.badRequest('error.files.notTextFile');
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
  execute: async (input, context) => {
    const { db } = context;
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    // 权限检查
    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'read');

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
    const { db } = context;
    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, input.id), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'write');

    const buffer = Buffer.from(input.content, 'utf-8');
    
    await uploadFile(fileRecord.storageKey, buffer, fileRecord.mimeType || 'text/plain', fileRecord.bucket);

    const [result] = await db.update(file)
      .set({
        size: buffer.length,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(file.id, input.id))
      .returning();

    return result as FileSelect;
  },
});

export const fileContentActions = [
  fileGetDownloadUrl,
  fileGetTextContent,
  fileGetContent,
  fileSaveContent,
];
