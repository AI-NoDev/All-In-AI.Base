/**
 * 分页查询AI会话消息
 */

import { t } from 'elysia';
import { eq, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSessionMessage } from '@qiyu-allinai/db/entities/ai';
import { aiSessionMessagePaginationBodySchema, aiSessionMessageSchemas, type AISessionMessageSelect } from './schemas';

export const aiSessionMessageGetByPagination = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.aiSessionMessage.getByPagination',
    displayName: '分页查询AI会话消息',
    description: `分页查询AI会话消息列表。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- sessionId: 按会话ID过滤（最常用）
- sessionIds: 按会话ID列表过滤
- role: 按角色过滤，user=用户消息，assistant=AI回复，system=系统消息
- roles: 按角色列表过滤
- contentType: 按内容类型过滤
- finishReason: 按完成原因过滤
- msgSeqStart/msgSeqEnd: 消息序号范围
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: msgSeq | createdAt
- order: asc | desc

**常用场景：**
1. 获取某会话的所有消息（按序号升序）
2. 获取最近N条消息

**示例：**
\`\`\`json
{
  "filter": { "sessionId": "session-uuid" },
  "sort": { "field": "msgSeq", "order": "asc" },
  "offset": 0,
  "limit": 50
}
\`\`\``,
    tags: ['ai', 'aiSessionMessage'],
    method: 'POST',
    path: '/api/ai/session-message/query',
  },
  schemas: {
    bodySchema: aiSessionMessagePaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(aiSessionMessageSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(aiSessionMessage.id, filter.ids));
      if (filter.sessionId) conditions.push(eq(aiSessionMessage.sessionId, filter.sessionId));
      if (filter.sessionIds?.length) conditions.push(inArray(aiSessionMessage.sessionId, filter.sessionIds));
      if (filter.role) conditions.push(eq(aiSessionMessage.role, filter.role));
      if (filter.roles?.length) conditions.push(inArray(aiSessionMessage.role, filter.roles));
      if (filter.contentType) conditions.push(eq(aiSessionMessage.contentType, filter.contentType));
      if (filter.contentTypes?.length) conditions.push(inArray(aiSessionMessage.contentType, filter.contentTypes));
      if (filter.finishReason) conditions.push(eq(aiSessionMessage.finishReason, filter.finishReason));
      if (filter.msgSeqStart !== undefined) conditions.push(gte(aiSessionMessage.msgSeq, filter.msgSeqStart));
      if (filter.msgSeqEnd !== undefined) conditions.push(lte(aiSessionMessage.msgSeq, filter.msgSeqEnd));
      if (filter.createdAtStart) conditions.push(gte(aiSessionMessage.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(aiSessionMessage.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'msgSeq';
    const sortColumn = aiSessionMessage[sortField as keyof AISessionMessageSelect];

    const data = await db.select().from(aiSessionMessage)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(aiSessionMessage).where(whereClause);
    return { data: data as AISessionMessageSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
