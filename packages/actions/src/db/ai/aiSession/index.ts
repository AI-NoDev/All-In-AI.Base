import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray, gte, lte, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { aiSession, aiSessionZodSchemas } from '@qiyu-allinai/db/entities/ai';

type AISessionSelect = typeof aiSession.$inferSelect;
type AISessionInsert = typeof aiSession.$inferInsert;

// ============ Filter Schema ============
const aiSessionFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  userId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
  title: z.string().optional(),
  isArchived: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  status: z.string().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
  lastMessageAtStart: z.iso.datetime().optional(),
  lastMessageAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['title', 'lastMessageAt', 'createdAt', 'updatedAt', 'messageCount']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: aiSessionFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const aiSessionGetByPagination = defineAction({
  meta: { name: 'ai.aiSession.getByPagination', displayName: '分页查询AI会话', description: '分页查询AI会话列表', tags: ['ai', 'aiSession'], method: 'POST', path: '/api/ai/session/query' },
  schemas: {
    bodySchema: paginationBodySchema,
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
    const sortColumn = aiSession[sortField as keyof typeof aiSession.$inferSelect];
    
    const data = await db.select().from(aiSession).where(whereClause).orderBy(orderFn(sortColumn)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(aiSession).where(whereClause);
    return { data: data as AISessionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const aiSessionGetByPk = defineAction({
  meta: { name: 'ai.aiSession.getByPk', displayName: '根据ID查询AI会话', description: '根据主键ID查询单个AI会话', tags: ['ai', 'aiSession'], method: 'GET', path: '/api/ai/session/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: aiSessionZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(aiSession).where(and(eq(aiSession.id, input.id), isNull(aiSession.deletedAt))).limit(1);
    return (result as AISessionSelect) ?? null;
  },
});

export const aiSessionCreate = defineAction({
  meta: { name: 'ai.aiSession.create', displayName: '创建AI会话', description: '创建单个AI会话', tags: ['ai', 'aiSession'], method: 'POST', path: '/api/ai/session' },
  schemas: {
    bodySchema: z.object({ data: aiSessionZodSchemas.insert }),
    outputSchema: aiSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(aiSession).values(input.data as AISessionInsert).returning();
    return result as AISessionSelect;
  },
});

export const aiSessionUpdate = defineAction({
  meta: { name: 'ai.aiSession.update', displayName: '更新AI会话', description: '更新单个AI会话', tags: ['ai', 'aiSession'], method: 'PUT', path: '/api/ai/session/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: aiSessionZodSchemas.update }),
    outputSchema: aiSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(aiSession).set({ ...input.data, updatedAt: new Date().toISOString() }).where(eq(aiSession.id, input.id)).returning();
    return result as AISessionSelect;
  },
});

export const aiSessionDelete = defineAction({
  meta: { name: 'ai.aiSession.delete', displayName: '删除AI会话', description: '软删除AI会话', tags: ['ai', 'aiSession'], method: 'DELETE', path: '/api/ai/session/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    await db.update(aiSession).set({ 
      deletedAt: new Date().toISOString(),
      deletedBy: currentUserId,
    }).where(eq(aiSession.id, input.id));
    return { success: true };
  },
});

export const aiSessionGetSchema = defineAction({
  meta: { name: 'ai.aiSession.getSchema', ignoreTools: true, displayName: '获取AI会话Schema', description: '获取AI会话表的JSON Schema', tags: ['ai', 'aiSession'], method: 'GET', path: '/api/ai/session/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(aiSessionZodSchemas.select) as Record<string, unknown>;
  },
});

export const aiSessionActions = [aiSessionGetByPagination, aiSessionGetByPk, aiSessionCreate, aiSessionUpdate, aiSessionDelete, aiSessionGetSchema];
