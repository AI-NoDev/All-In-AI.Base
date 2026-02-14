import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { provider, providerZodSchemas } from '@qiyu-allinai/db/entities/ai';

type ProviderSelect = typeof provider.$inferSelect;
type ProviderInsert = typeof provider.$inferInsert;

// ============ Filter Schema ============
const providerFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: providerFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const providerGetByPagination = defineAction({
  meta: { name: 'ai.provider.getByPagination', displayName: '分页查询AI提供商', description: '分页查询AI提供商列表', tags: ['ai', 'provider'], method: 'POST', path: '/api/ai/provider/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(providerZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(provider.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(provider.name, filter.names));
      if (filter.name) conditions.push(ilike(provider.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(provider.status, filter.status));
      if (filter.createdAtStart) conditions.push(gte(provider.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(provider.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? provider[sort.field as keyof typeof provider.$inferSelect] : provider.createdAt;
    
    const data = await db.select().from(provider).where(whereClause).orderBy(orderFn(sortColumn as any)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(provider).where(whereClause);
    return { data: data as ProviderSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const providerGetByPk = defineAction({
  meta: { name: 'ai.provider.getByPk', displayName: '根据ID查询AI提供商', description: '根据主键ID查询单个AI提供商', tags: ['ai', 'provider'], method: 'GET', path: '/api/ai/provider/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: providerZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(provider).where(eq(provider.id, input.id)).limit(1);
    return (result as ProviderSelect) ?? null;
  },
});

export const providerCreate = defineAction({
  meta: { name: 'ai.provider.create', displayName: '创建AI提供商', description: '创建单个AI提供商', tags: ['ai', 'provider'], method: 'POST', path: '/api/ai/provider' },
  schemas: {
    bodySchema: z.object({ data: providerZodSchemas.insert }),
    outputSchema: providerZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(provider).values(input.data as ProviderInsert).returning();
    return result as ProviderSelect;
  },
});

export const providerCreateMany = defineAction({
  meta: { name: 'ai.provider.createMany', displayName: '批量创建AI提供商', description: '批量创建多个AI提供商', tags: ['ai', 'provider'], method: 'POST', path: '/api/ai/provider/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(providerZodSchemas.insert) }),
    outputSchema: z.array(providerZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(provider).values(input.data as ProviderInsert[]).returning();
    return results as ProviderSelect[];
  },
});

export const providerUpdate = defineAction({
  meta: { name: 'ai.provider.update', displayName: '更新AI提供商', description: '根据ID更新单个AI提供商', tags: ['ai', 'provider'], method: 'PUT', path: '/api/ai/provider/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: providerZodSchemas.update }),
    outputSchema: providerZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(provider).set(input.data as Partial<ProviderInsert>).where(eq(provider.id, input.id)).returning();
    return result as ProviderSelect;
  },
});

export const providerUpdateMany = defineAction({
  meta: { name: 'ai.provider.updateMany', displayName: '批量更新AI提供商', description: '根据ID列表批量更新AI提供商', tags: ['ai', 'provider'], method: 'PUT', path: '/api/ai/provider/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: providerZodSchemas.update }),
    outputSchema: z.array(providerZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: ProviderSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(provider).set(input.data as Partial<ProviderInsert>).where(eq(provider.id, id)).returning();
      if (result) results.push(result as ProviderSelect);
    }
    return results;
  },
});

export const providerDeleteByPk = defineAction({
  meta: { name: 'ai.provider.deleteByPk', displayName: '删除AI提供商', description: '根据ID删除AI提供商', tags: ['ai', 'provider'], method: 'DELETE', path: '/api/ai/provider/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(provider).where(eq(provider.id, input.id)).returning();
    return !!result;
  },
});


export const providerGetSchema = defineAction({
  meta: { name: 'ai.provider.getSchema', ignoreTools: true, displayName: '获取AI提供商Schema', description: '获取AI提供商表的JSON Schema', tags: ['ai', 'provider'], method: 'GET', path: '/api/ai/provider/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(providerZodSchemas.select) as Record<string, unknown>;
  },
});

export const providerActions = [providerGetByPagination, providerGetByPk, providerCreate, providerCreateMany, providerUpdate, providerUpdateMany, providerDeleteByPk, providerGetSchema];
