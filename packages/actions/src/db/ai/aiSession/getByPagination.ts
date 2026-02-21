/**
 * 分页查询AI会话
 */

import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray, gte, lte, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSession } from '@qiyu-allinai/db/entities/ai';
import { aiSessionPaginationBodySchema, aiSessionZodSchemas } from './schemas';
import type { AISessionSelect } from './utils';

export const aiSessionGetByPagination = defineAction({
  meta: {
    name: 'ai.aiSession.getByPagination',
    displayName: '分页查询AI会话',
    description: `分页查询AI会话列表，自动排除已删除的会话。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- userId: 按用户ID过滤（查询某用户的所有会话）
- userIds: 按用户ID列表过滤
- title: 按标题模糊搜索
- isArchived: 是否已归档
- isPinned: 是否已置顶
- status: 按状态过滤
- createdAtStart/createdAtEnd: 创建时间范围
- lastMessageAtStart/lastMessageAtEnd: 最后消息时间范围

**排序参数 (sort)：**
- field: title | lastMessageAt | createdAt | updatedAt | messageCount
- order: asc | desc

**常用场景：**
1. 获取当前用户的会话列表（按最后消息时间倒序）
2. 获取置顶的会话
3. 获取归档的会话

**示例：**
\`\`\`json
{
  "filter": { "userId": "user-uuid", "isArchived": false },
  "sort": { "field": "lastMessageAt", "order": "desc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['ai', 'aiSession'],
    method: 'POST',
    path: '/api/ai/session/query',
  },
  schemas: {
    bodySchema: aiSessionPaginationBodySchema,
    outputSchema: z.object({ data: z.array(aiSessionZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [isNull(aiSession.deletedAt)];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(aiSession.id, filter.ids));
      if (filter.userId) conditions.push(eq(aiSession.userId, filter.userId));
      if (filter.userIds?.length) conditions.push(inArray(aiSession.userId, filter.userIds));
      if (filter.title) conditions.push(sql`${aiSession.title} ILIKE ${'%' + filter.title + '%'}`);
      if (filter.isArchived !== undefined) conditions.push(eq(aiSession.isArchived, filter.isArchived));
      if (filter.isPinned !== undefined) conditions.push(eq(aiSession.isPinned, filter.isPinned));
      if (filter.status) conditions.push(eq(aiSession.status, filter.status));
      if (filter.createdAtStart) conditions.push(gte(aiSession.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(aiSession.createdAt, filter.createdAtEnd));
      if (filter.lastMessageAtStart) conditions.push(gte(aiSession.lastMessageAt, filter.lastMessageAtStart));
      if (filter.lastMessageAtEnd) conditions.push(lte(aiSession.lastMessageAt, filter.lastMessageAtEnd));
    }

    const whereClause = and(...conditions);
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'createdAt';
    const sortColumn = aiSession[sortField as keyof AISessionSelect];

    const data = await db.select().from(aiSession)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(aiSession).where(whereClause);
    return { data: data as AISessionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
