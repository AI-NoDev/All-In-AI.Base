/**
 * 知识库文件内容读写 Actions
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeZodSchemas, NODE_TYPES, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission, isTextFile } from '../utils';

// S3 客户端导入
import {
  uploadFile,
  getFileAsString,
  getPresignedDownloadUrl,
} from '../../files/s3Client';

// ============ 获取下载URL ============
export const contentGetDownloadUrl = defineAction({
  meta: {
    name: 'knowledge.content.getDownloadUrl',
    displayName: '获取下载URL',
    description: '获取文件预签名下载URL',
    tags: ['knowledge', 'content'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/download-url',
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
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FILE)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'read');

    if (!nodeRecord.storageKey || !nodeRecord.bucket) {
      throw ActionError.badRequest('error.knowledge.noStorageKey');
    }

    const { url, expiresAt } = await getPresignedDownloadUrl(
      nodeRecord.storageKey,
      nodeRecord.bucket,
      3600,
      nodeRecord.originalName || nodeRecord.name
    );

    // 更新下载次数
    await db.update(node)
      .set({ downloadCount: (nodeRecord.downloadCount || 0) + 1 })
      .where(eq(node.id, input.id));

    return {
      url,
      expiresAt: expiresAt.toISOString(),
    };
  },
});

// ============ 获取文本内容 ============
export const contentGetText = defineAction({
  meta: {
    name: 'knowledge.content.getText',
    displayName: '获取文本内容',
    description: '获取文本文件内容',
    tags: ['knowledge', 'content'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/text',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({
      id: z.string(),
      name: z.string(),
      content: z.string(),
      mimeType: z.string().nullable(),
      extension: z.string().nullable(),
      parentId: z.string().nullable(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FILE)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'read');

    if (!isTextFile(nodeRecord.extension, nodeRecord.mimeType)) {
      throw ActionError.badRequest('error.knowledge.notTextFile');
    }

    if (!nodeRecord.storageKey || !nodeRecord.bucket) {
      throw ActionError.badRequest('error.knowledge.noStorageKey');
    }

    const content = await getFileAsString(nodeRecord.storageKey, nodeRecord.bucket);

    return {
      id: nodeRecord.id,
      name: nodeRecord.name,
      content,
      mimeType: nodeRecord.mimeType,
      extension: nodeRecord.extension,
      parentId: nodeRecord.parentId,
    };
  },
});

// ============ 保存文本内容 ============
export const contentSaveText = defineAction({
  meta: {
    name: 'knowledge.content.saveText',
    displayName: '保存文本内容',
    description: '保存文本文件内容',
    tags: ['knowledge', 'content'],
    method: 'PUT',
    path: '/api/knowledge/nodes/:id/text',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ content: z.string() }),
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FILE)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'write');

    if (!nodeRecord.storageKey || !nodeRecord.bucket) {
      throw ActionError.badRequest('error.knowledge.noStorageKey');
    }

    const buffer = Buffer.from(input.content, 'utf-8');
    
    await uploadFile(nodeRecord.storageKey, buffer, nodeRecord.mimeType || 'text/plain', nodeRecord.bucket);

    const [result] = await db.update(node)
      .set({
        size: buffer.length,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(node.id, input.id))
      .returning();

    return result as NodeSelect;
  },
});

// ============ 获取原始内容 ============
export const contentGetRaw = defineAction({
  meta: {
    name: 'knowledge.content.getRaw',
    displayName: '获取原始内容',
    description: '获取文件原始内容（不验证类型）',
    tags: ['knowledge', 'content'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/content',
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
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FILE)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'read');

    if (!nodeRecord.storageKey || !nodeRecord.bucket) {
      throw ActionError.badRequest('error.knowledge.noStorageKey');
    }

    const content = await getFileAsString(nodeRecord.storageKey, nodeRecord.bucket);

    return {
      content,
      mimeType: nodeRecord.mimeType,
    };
  },
});

export const contentActions = [
  contentGetDownloadUrl,
  contentGetText,
  contentSaveText,
  contentGetRaw,
];
