import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { aiSessionMessage, aiSessionMessageZodSchemas, aiSession } from '@qiyu-allinai/db/entities/ai';

type AISessionMessageSelect = typeof aiSessionMessage.$inferSelect;
type AISessionMessageInsert = typeof aiSessionMessage.$inferInsert;

// ============ Filter Schema ============
const aiSessionMessageFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  sessionId: z.string().optional(),
  sessionIds: z.array(z.string()).optional(),
  role: z.string().optional(),
  roles: z.array(z.string()).optional(),
  contentType: z.string().optional(),
  contentTypes: z.array(z.string()).optional(),
  finishReason: z.string().optional(),
  msgSeqStart: z.number().optional(),
  msgSeqEnd: z.number().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['msgSeq', 'createdAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: aiSessionMessageFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(50),
});

export const aiSessionMessageGetByPagination = defineAction({
  meta: { name: 'ai.aiSessionMessage.getByPagination', displayName: '分页查询AI会话消息', description: '分页查询AI会话消息列表', tags: ['ai', 'aiSessionMessage'], method: 'POST', path: '/api/ai/session-message/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(aiSessionMessageZodSchemas.select), total: z.number() }),
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
    const sortColumn = aiSessionMessage[sortField as keyof typeof aiSessionMessage.$inferSelect];
    
    const data = await db.select().from(aiSessionMessage).where(whereClause).orderBy(orderFn(sortColumn)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(aiSessionMessage).where(whereClause);
    return { data: data as AISessionMessageSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const aiSessionMessageGetByPk = defineAction({
  meta: { name: 'ai.aiSessionMessage.getByPk', displayName: '根据ID查询AI会话消息', description: '根据主键ID查询单个AI会话消息', tags: ['ai', 'aiSessionMessage'], method: 'GET', path: '/api/ai/session-message/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: aiSessionMessageZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(aiSessionMessage).where(eq(aiSessionMessage.id, input.id)).limit(1);
    return (result as AISessionMessageSelect) ?? null;
  },
});

export const aiSessionMessageCreate = defineAction({
  meta: { name: 'ai.aiSessionMessage.create', displayName: '创建AI会话消息', description: '创建单条AI会话消息', tags: ['ai', 'aiSessionMessage'], method: 'POST', path: '/api/ai/session-message' },
  schemas: {
    bodySchema: z.object({ data: aiSessionMessageZodSchemas.insert.omit({ msgSeq: true }) }),
    outputSchema: aiSessionMessageZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    // Get next msgSeq for session
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(aiSessionMessage).where(eq(aiSessionMessage.sessionId, input.data.sessionId));
    const nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;
    
    const [result] = await db.insert(aiSessionMessage).values({ ...input.data, msgSeq: nextSeq } as AISessionMessageInsert).returning();
    
    // Update session stats
    if (result) {
      const usage = input.data.tokenUsage;
      const totalTokens = usage?.totalTokens ?? 0;
      const inputTokens = usage?.inputTokens ?? 0;
      const outputTokens = usage?.outputTokens ?? 0;
      await db.update(aiSession).set({ 
        messageCount: sql`message_count + 1`,
        lastMessageAt: result.createdAt,
        tokenUsage: sql`jsonb_set(
          jsonb_set(
            jsonb_set(
              token_usage,
              '{totalTokens}',
              to_jsonb((token_usage->>'totalTokens')::int + ${totalTokens})
            ),
            '{promptTokens}',
            to_jsonb((token_usage->>'promptTokens')::int + ${inputTokens})
          ),
          '{completionTokens}',
          to_jsonb((token_usage->>'completionTokens')::int + ${outputTokens})
        )`,
        updatedAt: new Date().toISOString()
      }).where(eq(aiSession.id, input.data.sessionId));
    }
    
    return result as AISessionMessageSelect;
  },
});

export const aiSessionMessageCreateMany = defineAction({
  meta: { name: 'ai.aiSessionMessage.createMany', displayName: '批量创建AI会话消息', description: '批量创建AI会话消息', tags: ['ai', 'aiSessionMessage'], method: 'POST', path: '/api/ai/session-message/batch' },
  schemas: {
    bodySchema: z.object({ 
      sessionId: z.string(),
      messages: z.array(aiSessionMessageZodSchemas.insert.omit({ sessionId: true, msgSeq: true }))
    }),
    outputSchema: z.array(aiSessionMessageZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { sessionId, messages } = input;
    
    // Get current max msgSeq
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(aiSessionMessage).where(eq(aiSessionMessage.sessionId, sessionId));
    let nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;
    
    // Prepare messages with sequential msgSeq
    const messagesToInsert = messages.map(msg => ({
      ...msg,
      sessionId,
      msgSeq: nextSeq++
    })) as AISessionMessageInsert[];
    
    const results = await db.insert(aiSessionMessage).values(messagesToInsert).returning();
    
    // Update session stats
    const totalTokens = messages.reduce((sum, m) => sum + (m.tokenUsage?.totalTokens ?? 0), 0);
    const promptTokens = messages.reduce((sum, m) => sum + (m.tokenUsage?.inputTokens ?? 0), 0);
    const completionTokens = messages.reduce((sum, m) => sum + (m.tokenUsage?.outputTokens ?? 0), 0);
    const lastMessage = results[results.length - 1];
    
    if (lastMessage) {
      await db.update(aiSession).set({ 
        messageCount: sql`message_count + ${messages.length}`,
        lastMessageAt: lastMessage.createdAt,
        tokenUsage: sql`jsonb_set(
          jsonb_set(
            jsonb_set(
              token_usage,
              '{totalTokens}',
              to_jsonb((token_usage->>'totalTokens')::int + ${totalTokens})
            ),
            '{promptTokens}',
            to_jsonb((token_usage->>'promptTokens')::int + ${promptTokens})
          ),
          '{completionTokens}',
          to_jsonb((token_usage->>'completionTokens')::int + ${completionTokens})
        )`,
        updatedAt: new Date().toISOString()
      }).where(eq(aiSession.id, sessionId));
    }
    
    return results as AISessionMessageSelect[];
  },
});

export const aiSessionMessageGetHistory = defineAction({
  meta: { name: 'ai.aiSessionMessage.getHistory', displayName: '获取会话历史', description: '获取指定会话的消息历史', tags: ['ai', 'aiSessionMessage'], method: 'GET', path: '/api/ai/session-message/history/:sessionId' },
  schemas: {
    paramsSchema: z.object({ sessionId: z.string() }),
    querySchema: z.object({ 
      limit: z.coerce.number().int().min(1).max(200).default(50),
      beforeSeq: z.coerce.number().int().optional()
    }).optional(),
    outputSchema: z.array(aiSessionMessageZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const conditions = [eq(aiSessionMessage.sessionId, input.sessionId)];
    if (input.beforeSeq !== undefined) {
      conditions.push(lte(aiSessionMessage.msgSeq, input.beforeSeq));
    }
    
    const data = await db.select().from(aiSessionMessage)
      .where(and(...conditions))
      .orderBy(desc(aiSessionMessage.msgSeq))
      .limit(input.limit ?? 50);
    
    // Return in ascending order
    return (data as AISessionMessageSelect[]).reverse();
  },
});

export const aiSessionMessageGetSchema = defineAction({
  meta: { name: 'ai.aiSessionMessage.getSchema', ignoreTools: true, displayName: '获取AI会话消息Schema', description: '获取AI会话消息表的JSON Schema', tags: ['ai', 'aiSessionMessage'], method: 'GET', path: '/api/ai/session-message/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(aiSessionMessageZodSchemas.select) as Record<string, unknown>;
  },
});

export const aiSessionMessageDeleteFromSeq = defineAction({
  meta: { name: 'ai.aiSessionMessage.deleteFromSeq', displayName: '删除指定序号及之后的消息', description: '删除会话中指定msgSeq及之后的所有消息', tags: ['ai', 'aiSessionMessage'], method: 'DELETE', path: '/api/ai/session-message/from-seq/:sessionId/:msgSeq' },
  schemas: {
    paramsSchema: z.object({ sessionId: z.string(), msgSeq: z.coerce.number().int() }),
    outputSchema: z.object({ deletedCount: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { sessionId, msgSeq } = input;
    
    // 删除 msgSeq 及之后的消息
    const deleted = await db.delete(aiSessionMessage)
      .where(and(
        eq(aiSessionMessage.sessionId, sessionId),
        gte(aiSessionMessage.msgSeq, msgSeq)
      ))
      .returning();
    
    // 更新会话统计
    if (deleted.length > 0) {
      type TokenUsageType = { totalTokens?: number; inputTokens?: number; outputTokens?: number } | null;
      const deletedTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsageType)?.totalTokens ?? 0), 0);
      const deletedPromptTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsageType)?.inputTokens ?? 0), 0);
      const deletedCompletionTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsageType)?.outputTokens ?? 0), 0);
      
      // 获取最后一条消息
      const [lastMsg] = await db.select()
        .from(aiSessionMessage)
        .where(eq(aiSessionMessage.sessionId, sessionId))
        .orderBy(desc(aiSessionMessage.msgSeq))
        .limit(1);
      
      await db.update(aiSession).set({ 
        messageCount: sql`GREATEST(message_count - ${deleted.length}, 0)`,
        lastMessageAt: lastMsg?.createdAt ?? null,
        tokenUsage: sql`jsonb_set(
          jsonb_set(
            jsonb_set(
              token_usage,
              '{totalTokens}',
              to_jsonb(GREATEST((token_usage->>'totalTokens')::int - ${deletedTokens}, 0))
            ),
            '{promptTokens}',
            to_jsonb(GREATEST((token_usage->>'promptTokens')::int - ${deletedPromptTokens}, 0))
          ),
          '{completionTokens}',
          to_jsonb(GREATEST((token_usage->>'completionTokens')::int - ${deletedCompletionTokens}, 0))
        )`,
        updatedAt: new Date().toISOString()
      }).where(eq(aiSession.id, sessionId));
    }
    
    return { deletedCount: deleted.length };
  },
});

export const aiSessionMessageActions = [aiSessionMessageGetByPagination, aiSessionMessageGetByPk, aiSessionMessageCreate, aiSessionMessageCreateMany, aiSessionMessageGetHistory, aiSessionMessageDeleteFromSeq, aiSessionMessageGetSchema];
