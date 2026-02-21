/**
 * 分页查询Agent会话
 */

import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentSession } from '@qiyu-allinai/db/entities/ai';
import { agentSessionPaginationBodySchema, agentSessionZodSchemas } from './schemas';
import type { AgentSessionSelect } from './utils';

export const agentSessionGetByPagination = defineAction({
  meta: {
    name: 'ai.agentSession.getByPagination',
    displayName: '分页查询Agent会话',
    description: `分页查询Agent会话列表，用于管理用户与AI Agent的对话会话。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- agentId: 按单个Agent ID过滤
- agentIds: 按多个Agent ID过滤
- userId: 按单个用户ID过滤（查看某用户的所有会话）
- userIds: 按多个用户ID过滤
- title: 按会话标题模糊搜索
- status: 按状态过滤
- isArchived: 是否已归档，true/false
- isPinned: 是否已置顶，true/false
- lastMessageAtStart/lastMessageAtEnd: 最后消息时间范围
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: title | lastMessageAt | createdAt | updatedAt | messageCount
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
1. 获取当前用户的会话列表：filter.userId = "当前用户ID"
2. 获取置顶会话：filter.isPinned = true
3. 按最后消息时间排序：sort = { field: "lastMessageAt", order: "desc" }

**示例：**
\`\`\`json
{
  "filter": { "userId": "xxx", "isArchived": false },
  "sort": { "field": "lastMessageAt", "order": "desc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['ai', 'agentSession'],
    method: 'POST',
    path: '/api/ai/agent-session/query',
  },
  schemas: {
    bodySchema: agentSessionPaginationBodySchema,
    outputSchema: z.object({ data: z.array(agentSessionZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [isNull(agentSession.deletedAt)];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(agentSession.id, filter.ids));
      if (filter.agentId) conditions.push(eq(agentSession.agentId, filter.agentId));
      if (filter.agentIds?.length) conditions.push(inArray(agentSession.agentId, filter.agentIds));
      if (filter.userId) conditions.push(eq(agentSession.userId, filter.userId));
      if (filter.userIds?.length) conditions.push(inArray(agentSession.userId, filter.userIds));
      if (filter.title) conditions.push(ilike(agentSession.title, `%${filter.title}%`));
      if (filter.status) conditions.push(eq(agentSession.status, filter.status));
      if (filter.isArchived !== undefined) conditions.push(eq(agentSession.isArchived, filter.isArchived));
      if (filter.isPinned !== undefined) conditions.push(eq(agentSession.isPinned, filter.isPinned));
      if (filter.lastMessageAtStart) conditions.push(gte(agentSession.lastMessageAt, filter.lastMessageAtStart));
      if (filter.lastMessageAtEnd) conditions.push(lte(agentSession.lastMessageAt, filter.lastMessageAtEnd));
      if (filter.createdAtStart) conditions.push(gte(agentSession.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(agentSession.createdAt, filter.createdAtEnd));
    }

    const whereClause = and(...conditions);
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'lastMessageAt';
    const sortColumn = agentSession[sortField as keyof AgentSessionSelect];

    const data = await db.select().from(agentSession)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(agentSession).where(whereClause);
    return { data: data as AgentSessionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
