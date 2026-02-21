/**
 * 分页查询Agent消息
 */

import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentMessage } from '@qiyu-allinai/db/entities/ai';
import { agentMessagePaginationBodySchema, agentMessageZodSchemas } from './schemas';
import type { AgentMessageSelect } from './utils';

export const agentMessageGetByPagination = defineAction({
  meta: {
    name: 'ai.agentMessage.getByPagination',
    displayName: '分页查询Agent消息',
    description: `分页查询Agent消息列表。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- sessionId: 按会话ID过滤（获取某会话的所有消息）
- sessionIds: 按多个会话ID过滤
- role: 按角色过滤，"user" | "assistant" | "system" | "tool"
- roles: 按多个角色过滤
- contentType: 按内容类型过滤
- finishReason: 按完成原因过滤，如 "stop"、"length"
- msgSeqStart/msgSeqEnd: 消息序号范围
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: msgSeq | createdAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认50

**使用场景：**
1. 获取会话的消息列表：filter.sessionId = "xxx"
2. 只获取用户消息：filter.role = "user"
3. 按消息序号排序：sort = { field: "msgSeq", order: "asc" }

**示例：**
\`\`\`json
{
  "filter": { "sessionId": "xxx", "roles": ["user", "assistant"] },
  "sort": { "field": "msgSeq", "order": "asc" },
  "offset": 0,
  "limit": 50
}
\`\`\``,
    tags: ['ai', 'agentMessage'],
    method: 'POST',
    path: '/api/ai/agent-message/query',
  },
  schemas: {
    bodySchema: agentMessagePaginationBodySchema,
    outputSchema: z.object({ data: z.array(agentMessageZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(agentMessage.id, filter.ids));
      if (filter.sessionId) conditions.push(eq(agentMessage.sessionId, filter.sessionId));
      if (filter.sessionIds?.length) conditions.push(inArray(agentMessage.sessionId, filter.sessionIds));
      if (filter.role) conditions.push(eq(agentMessage.role, filter.role));
      if (filter.roles?.length) conditions.push(inArray(agentMessage.role, filter.roles));
      if (filter.contentType) conditions.push(eq(agentMessage.contentType, filter.contentType));
      if (filter.contentTypes?.length) conditions.push(inArray(agentMessage.contentType, filter.contentTypes));
      if (filter.finishReason) conditions.push(eq(agentMessage.finishReason, filter.finishReason));
      if (filter.msgSeqStart !== undefined) conditions.push(gte(agentMessage.msgSeq, filter.msgSeqStart));
      if (filter.msgSeqEnd !== undefined) conditions.push(lte(agentMessage.msgSeq, filter.msgSeqEnd));
      if (filter.createdAtStart) conditions.push(gte(agentMessage.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(agentMessage.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'msgSeq';
    const sortColumn = agentMessage[sortField as keyof AgentMessageSelect];

    const data = await db.select().from(agentMessage)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(agentMessage).where(whereClause);
    return { data: data as AgentMessageSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
