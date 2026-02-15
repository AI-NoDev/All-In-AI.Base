import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { agent, agentZodSchemas } from '@qiyu-allinai/db/entities/ai';

type AgentSelect = typeof agent.$inferSelect;
type AgentInsert = typeof agent.$inferInsert;

// ============ Filter Schema ============
const agentFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  providerId: z.string().optional(),
  providerIds: z.array(z.string()).optional(),
  modelId: z.string().optional(),
  modelIds: z.array(z.string()).optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  supportLoop: z.boolean().optional(),
  contextStrategy: z.string().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: agentFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const agentGetByPagination = defineAction({
  meta: { name: 'ai.agent.getByPagination', displayName: '分页查询AI智能体', description: '分页查询AI智能体列表', tags: ['ai', 'agent'], method: 'POST', path: '/api/ai/agent/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(agentZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(agent.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(agent.name, filter.names));
      if (filter.providerId) conditions.push(eq(agent.providerId, filter.providerId));
      if (filter.providerIds?.length) conditions.push(inArray(agent.providerId, filter.providerIds));
      if (filter.modelId) conditions.push(eq(agent.modelId, filter.modelId));
      if (filter.modelIds?.length) conditions.push(inArray(agent.modelId, filter.modelIds));
      if (filter.name) conditions.push(ilike(agent.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(agent.status, filter.status));
      if (filter.supportLoop !== undefined) conditions.push(eq(agent.supportLoop, filter.supportLoop));
      if (filter.contextStrategy) conditions.push(eq(agent.contextStrategy, filter.contextStrategy));
      if (filter.createdAtStart) conditions.push(gte(agent.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(agent.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? agent[sort.field as keyof typeof agent.$inferSelect] : agent.createdAt;
    
    const data = await db.select().from(agent).where(whereClause).orderBy(orderFn(sortColumn as any)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(agent).where(whereClause);
    return { data: data as AgentSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const agentGetByPk = defineAction({
  meta: { name: 'ai.agent.getByPk', displayName: '根据ID查询AI智能体', description: '根据主键ID查询单个AI智能体', tags: ['ai', 'agent'], method: 'GET', path: '/api/ai/agent/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: agentZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(agent).where(eq(agent.id, input.id)).limit(1);
    return (result as AgentSelect) ?? null;
  },
});

export const agentCreate = defineAction({
  meta: { name: 'ai.agent.create', displayName: '创建AI智能体', description: '创建单个AI智能体', tags: ['ai', 'agent'], method: 'POST', path: '/api/ai/agent' },
  schemas: {
    bodySchema: z.object({ data: agentZodSchemas.insert }),
    outputSchema: agentZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(agent).values(input.data as AgentInsert).returning();
    return result as AgentSelect;
  },
});

export const agentCreateMany = defineAction({
  meta: { name: 'ai.agent.createMany', displayName: '批量创建AI智能体', description: '批量创建多个AI智能体', tags: ['ai', 'agent'], method: 'POST', path: '/api/ai/agent/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(agentZodSchemas.insert) }),
    outputSchema: z.array(agentZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(agent).values(input.data as AgentInsert[]).returning();
    return results as AgentSelect[];
  },
});

export const agentUpdate = defineAction({
  meta: { name: 'ai.agent.update', displayName: '更新AI智能体', description: '根据ID更新单个AI智能体', tags: ['ai', 'agent'], method: 'PUT', path: '/api/ai/agent/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: agentZodSchemas.update }),
    outputSchema: agentZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agent).set(input.data as Partial<AgentInsert>).where(eq(agent.id, input.id)).returning();
    return result as AgentSelect;
  },
});

export const agentUpdateMany = defineAction({
  meta: { name: 'ai.agent.updateMany', displayName: '批量更新AI智能体', description: '根据ID列表批量更新AI智能体', tags: ['ai', 'agent'], method: 'PUT', path: '/api/ai/agent/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: agentZodSchemas.update }),
    outputSchema: z.array(agentZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: AgentSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(agent).set(input.data as Partial<AgentInsert>).where(eq(agent.id, id)).returning();
      if (result) results.push(result as AgentSelect);
    }
    return results;
  },
});

export const agentDeleteByPk = defineAction({
  meta: { name: 'ai.agent.deleteByPk', displayName: '删除AI智能体', description: '根据ID删除AI智能体', tags: ['ai', 'agent'], method: 'DELETE', path: '/api/ai/agent/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(agent).where(eq(agent.id, input.id)).returning();
    return !!result;
  },
});


export const agentGetSchema = defineAction({
  meta: { name: 'ai.agent.getSchema', ignoreTools: true, displayName: '获取AI智能体Schema', description: '获取AI智能体表的JSON Schema', tags: ['ai', 'agent'], method: 'GET', path: '/api/ai/agent/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(agentZodSchemas.select) as Record<string, unknown>;
  },
});

export const agentActions = [agentGetByPagination, agentGetByPk, agentCreate, agentCreateMany, agentUpdate, agentUpdateMany, agentDeleteByPk, agentGetSchema];
