/**
 * 分页查询API密钥
 */

import { z } from 'zod';
import { eq, sql, and, asc, desc, inArray, like } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { apiKey, apiKeyMcp } from '@qiyu-allinai/db/entities/ai';
import { paginationBodySchema, apiKeyWithMcpsSchema } from './schemas';

export const apiKeyGetByPagination = defineAction({
  meta: {
    name: 'ai.apiKey.getByPagination',
    displayName: '分页查询API密钥',
    description: '查询API密钥列表，支持分页和过滤。filter可选字段：name(模糊匹配)、isRevoked(是否已撤销)、status。sort支持createdAt/name/lastUsedAt排序。返回包含关联MCP服务ID列表。示例：{"filter":{"isRevoked":false},"limit":20,"offset":0}',
    tags: ['ai', 'apiKey'],
    method: 'POST',
    path: '/api/ai/api-key/query',
  },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(apiKeyWithMcpsSchema), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(apiKey.id, filter.ids));
      if (filter.name) conditions.push(like(apiKey.name, `%${filter.name}%`));
      if (filter.isRevoked !== undefined) conditions.push(eq(apiKey.isRevoked, filter.isRevoked));
      if (filter.status) conditions.push(eq(apiKey.status, filter.status));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? apiKey[sort.field as keyof typeof apiKey.$inferSelect] : apiKey.createdAt;
    
    const data = await db.select().from(apiKey)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);
    
    // 获取每个 API Key 关联的 MCP 服务
    const result = await Promise.all(data.map(async (key) => {
      const mcps = await db.select({ mcpServerId: apiKeyMcp.mcpServerId })
        .from(apiKeyMcp)
        .where(eq(apiKeyMcp.apiKeyId, key.id));
      return { ...key, mcpServerIds: mcps.map(m => m.mcpServerId) };
    }));
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(apiKey).where(whereClause);
    return { data: result, total: Number(countResult[0]?.count ?? 0) };
  },
});
