/**
 * 知识库文件版本 Actions（仅文件类型节点）
 */

import { z } from 'zod';
import { eq, and, isNull, desc, sql, inArray, gte, lte, asc } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { toJSONSchema } from '../../core/schema';
import { node, nodeVersion, nodeVersionZodSchemas, nodeZodSchemas, NODE_TYPES, type NodeSelect, type NodeVersionSelect, type NodeVersionInsert } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';
import { getPresignedDownloadUrl, DEFAULT_BUCKET } from '../../files/s3Client';

// ============ 获取版本列表 ============
export const versionList = defineAction({
  meta: {
    name: 'knowledge.version.list',
    displayName: '获取版本列表',
    description: '获取文件的所有历史版本',
    tags: ['knowledge', 'version'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/versions',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({ data: z.array(nodeVersionZodSchemas.select) }),
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
    
    const versions = await db.select().from(nodeVersion)
      .where(eq(nodeVersion.nodeId, input.id))
      .orderBy(desc(nodeVersion.createdAt));
    
    return { data: versions as NodeVersionSelect[] };
  },
});

// ============ 下载历史版本 ============
export const versionDownload = defineAction({
  meta: {
    name: 'knowledge.version.download',
    displayName: '下载历史版本',
    description: '获取历史版本的下载URL',
    tags: ['knowledge', 'version'],
    method: 'GET',
    path: '/api/knowledge/versions/:id/download-url',
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
    const [versionRecord] = await db.select().from(nodeVersion)
      .where(eq(nodeVersion.id, input.id))
      .limit(1);

    if (!versionRecord) {
      throw ActionError.notFound('error.knowledge.versionNotFound');
    }

    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, versionRecord.nodeId), isNull(node.deletedAt)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'read');

    const baseName = (nodeRecord.originalName || nodeRecord.name).replace(/\.[^.]+$/, '');
    const ext = nodeRecord.extension ? `.${nodeRecord.extension}` : '';
    const downloadName = `${baseName}_${versionRecord.versionNumber}${ext}`;

    const { url, expiresAt } = await getPresignedDownloadUrl(
      versionRecord.storageKey,
      versionRecord.bucket,
      3600,
      downloadName
    );

    return { url, expiresAt: expiresAt.toISOString() };
  },
});

// ============ 恢复历史版本 ============
export const versionRestore = defineAction({
  meta: {
    name: 'knowledge.version.restore',
    displayName: '恢复历史版本',
    description: '将历史版本恢复为当前版本',
    tags: ['knowledge', 'version'],
    method: 'POST',
    path: '/api/knowledge/versions/:id/restore',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [versionRecord] = await db.select().from(nodeVersion)
      .where(eq(nodeVersion.id, input.id))
      .limit(1);

    if (!versionRecord) {
      throw ActionError.notFound('error.knowledge.versionNotFound');
    }

    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, versionRecord.nodeId), isNull(node.deletedAt)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'write');

    // 获取当前最大版本号
    const existingVersions = await db.select({ versionNumber: nodeVersion.versionNumber })
      .from(nodeVersion)
      .where(eq(nodeVersion.nodeId, nodeRecord.id));

    let maxVersion = 0;
    for (const v of existingVersions) {
      const num = parseInt(v.versionNumber.replace('v', ''), 10);
      if (!isNaN(num) && num > maxVersion) maxVersion = num;
    }
    const newVersionNumber = `v${maxVersion + 1}`;

    // 将当前文件保存为新版本
    if (nodeRecord.storageKey) {
      await db.insert(nodeVersion).values({
        nodeId: nodeRecord.id,
        versionNumber: newVersionNumber,
        storageKey: nodeRecord.storageKey,
        bucket: nodeRecord.bucket || DEFAULT_BUCKET,
        s3VersionId: nodeRecord.versionId,
        etag: nodeRecord.etag,
        size: nodeRecord.size,
        changeLog: `恢复到 ${versionRecord.versionNumber}`,
        createdById: context.currentUserId,
        createdBy: context.currentUserName,
      } as NodeVersionInsert);
    }

    // 将历史版本的S3字段更新到主节点
    const [result] = await db.update(node)
      .set({
        storageKey: versionRecord.storageKey,
        bucket: versionRecord.bucket,
        versionId: versionRecord.s3VersionId,
        etag: versionRecord.etag,
        size: versionRecord.size,
        versionCount: (nodeRecord.versionCount || 0) + 1,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(node.id, nodeRecord.id))
      .returning();

    return result as NodeSelect;
  },
});

// ============ 分页查询版本 ============
const versionFilterSchema = z.object({
  nodeIds: z.array(z.string()).optional(),
  nodeId: z.string().optional(),
  versionNumber: z.string().optional(),
  createdAtStart: z.string().datetime().optional(),
  createdAtEnd: z.string().datetime().optional(),
}).optional();

export const versionGetByPagination = defineAction({
  meta: {
    name: 'knowledge.version.getByPagination',
    displayName: '分页查询版本',
    description: '分页查询文件版本列表',
    tags: ['knowledge', 'version'],
    method: 'POST',
    path: '/api/knowledge/versions/query',
  },
  schemas: {
    bodySchema: z.object({
      filter: versionFilterSchema,
      sort: z.object({
        field: z.enum(['versionNumber', 'size', 'createdAt']),
        order: z.enum(['asc', 'desc']),
      }).optional(),
      offset: z.number().int().min(0).default(0),
      limit: z.number().int().min(1).max(100).default(20),
    }),
    outputSchema: z.object({ data: z.array(nodeVersionZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    
    const conditions = [];
    
    if (filter) {
      if (filter.nodeIds?.length) conditions.push(inArray(nodeVersion.nodeId, filter.nodeIds));
      if (filter.nodeId) conditions.push(eq(nodeVersion.nodeId, filter.nodeId));
      if (filter.versionNumber) conditions.push(sql`${nodeVersion.versionNumber} ILIKE ${'%' + filter.versionNumber + '%'}`);
      if (filter.createdAtStart) conditions.push(gte(nodeVersion.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(nodeVersion.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    
    let sortColumn;
    if (sort?.field === 'versionNumber') {
      sortColumn = nodeVersion.versionNumber;
    } else if (sort?.field === 'size') {
      sortColumn = nodeVersion.size;
    } else {
      sortColumn = nodeVersion.createdAt;
    }
    
    const data = await db.select().from(nodeVersion)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(nodeVersion).where(whereClause);
    return { data: data as NodeVersionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

// ============ 获取 Schema ============
export const versionGetSchema = defineAction({
  meta: {
    name: 'knowledge.version.getSchema',
    displayName: '获取版本Schema',
    description: '获取版本表的JSON Schema',
    tags: ['knowledge', 'version'],
    method: 'GET',
    path: '/api/knowledge/versions/schema',
    ignoreTools: true,
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(nodeVersionZodSchemas.select) as Record<string, unknown>;
  },
});

export const versionActions = [
  versionList,
  versionDownload,
  versionRestore,
  versionGetByPagination,
  versionGetSchema,
];
