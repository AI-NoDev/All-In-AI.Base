import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { agentMessage, agentMessageZodSchemas, agentSession } from '@qiyu-allinai/db/entities/ai';

type AgentMessageSelect = typeof agentMessage.$inferSelect;
type AgentMessageInsert = typeof agentMessage.$inferInsert;

// ============ Filter Schema ============
const agentMessageFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  sessionId: z.string().optional(),
  sessionIds: z.array(z.string()).optional(),
  role: z.string().optional(),
  roles: z.array(z.string()).optional(),
  contentType: z.string().optional(),
  contentTypes: z.array(z.string()).optional(),
  modelId: z.string().optional(),
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
  filter: agentMessageFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(50),
});

export const agentMessageGetByPagination = defineAction({
  meta: { name: 'ai.agentMessage.getByPagination', displayName: '分页查询Agent消息', description: '分页查询Agent消息列表', tags: ['ai', 'agentMessage'], method: 'POST', path: '/api/ai/agent-message/query' },
  schemas: {
    bodySchema: paginationBodySchema,
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
      if (filter.modelId) conditions.push(eq(agentMessage.modelId, filter.modelId));
      if (filter.finishReason) conditions.push(eq(agentMessage.finishReason, filter.finishReason));
      if (filter.msgSeqStart !== undefined) conditions.push(gte(agentMessage.msgSeq, filter.msgSeqStart));
      if (filter.msgSeqEnd !== undefined) conditions.push(lte(agentMessage.msgSeq, filter.msgSeqEnd));
      if (filter.createdAtStart) conditions.push(gte(agentMessage.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(agentMessage.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'msgSeq';
    const sortColumn = agentMessage[sortField as keyof typeof agentMessage.$inferSelect];
    
    const data = await db.select().from(agentMessage).where(whereClause).orderBy(orderFn(sortColumn)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(agentMessage).where(whereClause);
    return { data: data as AgentMessageSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const agentMessageGetByPk = defineAction({
  meta: { name: 'ai.agentMessage.getByPk', displayName: '根据ID查询Agent消息', description: '根据主键ID查询单个Agent消息', tags: ['ai', 'agentMessage'], method: 'GET', path: '/api/ai/agent-message/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: agentMessageZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(agentMessage).where(eq(agentMessage.id, input.id)).limit(1);
    return (result as AgentMessageSelect) ?? null;
  },
});

export const agentMessageCreate = defineAction({
  meta: { name: 'ai.agentMessage.create', displayName: '创建Agent消息', description: '创建单条Agent消息', tags: ['ai', 'agentMessage'], method: 'POST', path: '/api/ai/agent-message' },
  schemas: {
    bodySchema: z.object({ data: agentMessageZodSchemas.insert }),
    outputSchema: agentMessageZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    // Get next msgSeq for session
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(agentMessage).where(eq(agentMessage.sessionId, input.data.sessionId));
    const nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;
    
    const [result] = await db.insert(agentMessage).values({ ...input.data, msgSeq: nextSeq } as AgentMessageInsert).returning();
    
    // Update session stats
    if (result) {
      const tokenCount = input.data.tokenCount ?? 0;
      await db.update(agentSession).set({ 
        messageCount: sql`message_count + 1`,
        lastMessageAt: result.createdAt,
        tokenUsage: sql`jsonb_set(
          jsonb_set(
            token_usage,
            '{totalTokens}',
            to_jsonb((token_usage->>'totalTokens')::int + ${tokenCount})
          ),
          '{${input.data.role === 'user' ? 'promptTokens' : 'completionTokens'}}',
          to_jsonb((token_usage->>'${input.data.role === 'user' ? 'promptTokens' : 'completionTokens'}')::int + ${tokenCount})
        )`,
        updatedAt: new Date().toISOString()
      }).where(eq(agentSession.id, input.data.sessionId));
    }
    
    return result as AgentMessageSelect;
  },
});

export const agentMessageCreateMany = defineAction({
  meta: { name: 'ai.agentMessage.createMany', displayName: '批量创建Agent消息', description: '批量创建Agent消息', tags: ['ai', 'agentMessage'], method: 'POST', path: '/api/ai/agent-message/batch' },
  schemas: {
    bodySchema: z.object({ 
      sessionId: z.string(),
      messages: z.array(agentMessageZodSchemas.insert.omit({ sessionId: true, msgSeq: true }))
    }),
    outputSchema: z.array(agentMessageZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { sessionId, messages } = input;
    
    // Get current max msgSeq
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(agentMessage).where(eq(agentMessage.sessionId, sessionId));
    let nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;
    
    // Prepare messages with sequential msgSeq
    const messagesToInsert = messages.map(msg => ({
      ...msg,
      sessionId,
      msgSeq: nextSeq++
    })) as AgentMessageInsert[];
    
    const results = await db.insert(agentMessage).values(messagesToInsert).returning();
    
    // Update session stats
    const totalTokens = messages.reduce((sum, m) => sum + (m.tokenCount ?? 0), 0);
    const promptTokens = messages.filter(m => m.role === 'user').reduce((sum, m) => sum + (m.tokenCount ?? 0), 0);
    const completionTokens = totalTokens - promptTokens;
    const lastMessage = results[results.length - 1];
    
    if (lastMessage) {
      await db.update(agentSession).set({ 
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
      }).where(eq(agentSession.id, sessionId));
    }
    
    return results as AgentMessageSelect[];
  },
});

export const agentMessageGetHistory = defineAction({
  meta: { name: 'ai.agentMessage.getHistory', displayName: '获取会话历史', description: '获取指定会话的消息历史', tags: ['ai', 'agentMessage'], method: 'GET', path: '/api/ai/agent-message/history/:sessionId' },
  schemas: {
    paramsSchema: z.object({ sessionId: z.string() }),
    querySchema: z.object({ 
      limit: z.coerce.number().int().min(1).max(200).default(50),
      beforeSeq: z.coerce.number().int().optional()
    }).optional(),
    outputSchema: z.array(agentMessageZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const conditions = [eq(agentMessage.sessionId, input.sessionId)];
    if (input.beforeSeq !== undefined) {
      conditions.push(lte(agentMessage.msgSeq, input.beforeSeq));
    }
    
    const data = await db.select().from(agentMessage)
      .where(and(...conditions))
      .orderBy(desc(agentMessage.msgSeq))
      .limit(input.limit ?? 50);
    
    // Return in ascending order
    return (data as AgentMessageSelect[]).reverse();
  },
});


export const agentMessageGetSchema = defineAction({
  meta: { name: 'ai.agentMessage.getSchema', ignoreTools: true, displayName: '获取Agent消息Schema', description: '获取Agent消息表的JSON Schema', tags: ['ai', 'agentMessage'], method: 'GET', path: '/api/ai/agent-message/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(agentMessageZodSchemas.select) as Record<string, unknown>;
  },
});

export const agentMessageActions = [agentMessageGetByPagination, agentMessageGetByPk, agentMessageCreate, agentMessageCreateMany, agentMessageGetHistory, agentMessageGetSchema];
