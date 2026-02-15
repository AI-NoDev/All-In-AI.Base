import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { agentSession, agentSessionZodSchemas } from '@qiyu-allinai/db/entities/ai';

type AgentSessionSelect = typeof agentSession.$inferSelect;
type AgentSessionInsert = typeof agentSession.$inferInsert;

// ============ Filter Schema ============
const agentSessionFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  agentId: z.string().optional(),
  agentIds: z.array(z.string()).optional(),
  userId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  isArchived: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  lastMessageAtStart: z.iso.datetime().optional(),
  lastMessageAtEnd: z.iso.datetime().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['title', 'lastMessageAt', 'createdAt', 'updatedAt', 'messageCount']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: agentSessionFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const agentSessionGetByPagination = defineAction({
  meta: { name: 'ai.agentSession.getByPagination', displayName: '分页查询Agent会话', description: '分页查询Agent会话列表', tags: ['ai', 'agentSession'], method: 'POST', path: '/api/ai/agent-session/query' },
  schemas: {
    bodySchema: paginationBodySchema,
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
    const sortColumn = agentSession[sortField as keyof typeof agentSession.$inferSelect];
    
    const data = await db.select().from(agentSession).where(whereClause).orderBy(orderFn(sortColumn)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(agentSession).where(whereClause);
    return { data: data as AgentSessionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const agentSessionGetByPk = defineAction({
  meta: { name: 'ai.agentSession.getByPk', displayName: '根据ID查询Agent会话', description: '根据主键ID查询单个Agent会话', tags: ['ai', 'agentSession'], method: 'GET', path: '/api/ai/agent-session/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: agentSessionZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(agentSession).where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt))).limit(1);
    return (result as AgentSessionSelect) ?? null;
  },
});

export const agentSessionCreate = defineAction({
  meta: { name: 'ai.agentSession.create', displayName: '创建Agent会话', description: '创建单个Agent会话', tags: ['ai', 'agentSession'], method: 'POST', path: '/api/ai/agent-session' },
  schemas: {
    bodySchema: z.object({ data: agentSessionZodSchemas.insert }),
    outputSchema: agentSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(agentSession).values(input.data as AgentSessionInsert).returning();
    return result as AgentSessionSelect;
  },
});

export const agentSessionUpdate = defineAction({
  meta: { name: 'ai.agentSession.update', displayName: '更新Agent会话', description: '根据ID更新单个Agent会话', tags: ['ai', 'agentSession'], method: 'PUT', path: '/api/ai/agent-session/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: agentSessionZodSchemas.update }),
    outputSchema: agentSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agentSession).set(input.data as Partial<AgentSessionInsert>).where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt))).returning();
    return result as AgentSessionSelect;
  },
});

export const agentSessionArchive = defineAction({
  meta: { name: 'ai.agentSession.archive', displayName: '归档Agent会话', description: '归档指定Agent会话', tags: ['ai', 'agentSession'], method: 'PUT', path: '/api/ai/agent-session/:id/archive' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ isArchived: z.boolean() }),
    outputSchema: agentSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agentSession).set({ 
      isArchived: input.isArchived,
      updatedAt: new Date().toISOString()
    }).where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt))).returning();
    return result as AgentSessionSelect;
  },
});

export const agentSessionPin = defineAction({
  meta: { name: 'ai.agentSession.pin', displayName: '置顶Agent会话', description: '置顶/取消置顶Agent会话', tags: ['ai', 'agentSession'], method: 'PUT', path: '/api/ai/agent-session/:id/pin' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ isPinned: z.boolean() }),
    outputSchema: agentSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agentSession).set({ 
      isPinned: input.isPinned,
      updatedAt: new Date().toISOString()
    }).where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt))).returning();
    return result as AgentSessionSelect;
  },
});

export const agentSessionDeleteByPk = defineAction({
  meta: { name: 'ai.agentSession.deleteByPk', displayName: '删除Agent会话', description: '根据ID软删除Agent会话', tags: ['ai', 'agentSession'], method: 'DELETE', path: '/api/ai/agent-session/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agentSession).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName
    }).where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt))).returning();
    return !!result;
  },
});


export const agentSessionGetSchema = defineAction({
  meta: { name: 'ai.agentSession.getSchema', ignoreTools: true, displayName: '获取Agent会话Schema', description: '获取Agent会话表的JSON Schema', tags: ['ai', 'agentSession'], method: 'GET', path: '/api/ai/agent-session/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(agentSessionZodSchemas.select) as Record<string, unknown>;
  },
});

export const agentSessionActions = [agentSessionGetByPagination, agentSessionGetByPk, agentSessionCreate, agentSessionUpdate, agentSessionArchive, agentSessionPin, agentSessionDeleteByPk, agentSessionGetSchema];
