import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { dictGroup, dictGroupZodSchemas } from '@qiyu-allinai/db/entities/system';

type DictGroupSelect = typeof dictGroup.$inferSelect;
type DictGroupInsert = typeof dictGroup.$inferInsert;

// ============ Filter Schema ============
const dictGroupFilterSchema = z.object({
  // IN 查询
  keys: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  // 精确匹配
  status: z.enum(['0', '1']).optional(),
  // 模糊匹配
  key: z.string().optional(),
  name: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['key', 'name', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: dictGroupFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const dictGroupGetByPagination = defineAction({
  meta: { name: 'system.dictGroup.getByPagination', displayName: '分页查询字典组', description: '分页查询字典组列表', tags: ['system', 'dictGroup'], method: 'POST', path: '/api/system/dict-group/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(dictGroupZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.keys?.length) conditions.push(inArray(dictGroup.key, filter.keys));
      if (filter.names?.length) conditions.push(inArray(dictGroup.name, filter.names));
      // 精确匹配
      if (filter.status) conditions.push(eq(dictGroup.status, filter.status));
      // 模糊匹配
      if (filter.key) conditions.push(ilike(dictGroup.key, `%${filter.key}%`));
      if (filter.name) conditions.push(ilike(dictGroup.name, `%${filter.name}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(dictGroup.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(dictGroup.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? dictGroup[sort.field as keyof typeof dictGroup.$inferSelect] : dictGroup.createdAt;
    
    const data = await db.select().from(dictGroup)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(dictGroup).where(whereClause);
    return { data: data as DictGroupSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const dictGroupGetByPk = defineAction({
  meta: { name: 'system.dictGroup.getByPk', displayName: '根据Key查询字典组', description: '根据主键Key查询单个字典组', tags: ['system', 'dictGroup'], method: 'GET', path: '/api/system/dict-group/:key' },
  schemas: {
    paramsSchema: z.object({ key: z.string().min(1).max(100) }),
    outputSchema: dictGroupZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(dictGroup).where(eq(dictGroup.key, input.key)).limit(1);
    return (result as DictGroupSelect) ?? null;
  },
});

export const dictGroupCreate = defineAction({
  meta: { name: 'system.dictGroup.create', displayName: '创建字典组', description: '创建单个字典组', tags: ['system', 'dictGroup'], method: 'POST', path: '/api/system/dict-group' },
  schemas: {
    bodySchema: z.object({ data: dictGroupZodSchemas.insert }),
    outputSchema: dictGroupZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(dictGroup).values(input.data as DictGroupInsert).returning();
    return result as DictGroupSelect;
  },
});


export const dictGroupCreateMany = defineAction({
  meta: { name: 'system.dictGroup.createMany', displayName: '批量创建字典组', description: '批量创建多个字典组', tags: ['system', 'dictGroup'], method: 'POST', path: '/api/system/dict-group/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(dictGroupZodSchemas.insert) }),
    outputSchema: z.array(dictGroupZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(dictGroup).values(input.data as DictGroupInsert[]).returning();
    return results as DictGroupSelect[];
  },
});

export const dictGroupUpdate = defineAction({
  meta: { name: 'system.dictGroup.update', displayName: '更新字典组', description: '根据Key更新单个字典组', tags: ['system', 'dictGroup'], method: 'PUT', path: '/api/system/dict-group/:key' },
  schemas: {
    paramsSchema: z.object({ key: z.string().min(1).max(100) }),
    bodySchema: z.object({ data: dictGroupZodSchemas.update }),
    outputSchema: dictGroupZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(dictGroup).set(input.data as Partial<DictGroupInsert>).where(eq(dictGroup.key, input.key)).returning();
    return result as DictGroupSelect;
  },
});

export const dictGroupUpdateMany = defineAction({
  meta: { name: 'system.dictGroup.updateMany', displayName: '批量更新字典组', description: '根据Key列表批量更新字典组', tags: ['system', 'dictGroup'], method: 'PUT', path: '/api/system/dict-group/batch' },
  schemas: {
    bodySchema: z.object({ keys: z.array(z.string().min(1).max(100)), data: dictGroupZodSchemas.update }),
    outputSchema: z.array(dictGroupZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: DictGroupSelect[] = [];
    for (const key of input.keys) {
      const [result] = await db.update(dictGroup).set(input.data as Partial<DictGroupInsert>).where(eq(dictGroup.key, key)).returning();
      if (result) results.push(result as DictGroupSelect);
    }
    return results;
  },
});

export const dictGroupDeleteByPk = defineAction({
  meta: { name: 'system.dictGroup.deleteByPk', displayName: '删除字典组', description: '根据Key删除字典组', tags: ['system', 'dictGroup'], method: 'DELETE', path: '/api/system/dict-group/:key' },
  schemas: {
    paramsSchema: z.object({ key: z.string().min(1).max(100) }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(dictGroup).where(eq(dictGroup.key, input.key)).returning();
    return !!result;
  },
});


export const dictGroupGetSchema = defineAction({
  meta: { name: 'system.dictGroup.getSchema', ignoreTools: true, displayName: '获取字典组Schema', description: '获取字典组表的JSON Schema', tags: ['system', 'dictGroup'], method: 'GET', path: '/api/system/dict-group/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(dictGroupZodSchemas.select) as Record<string, unknown>;
  },
});

export const dictGroupActions = [dictGroupGetByPagination, dictGroupGetByPk, dictGroupCreate, dictGroupCreateMany, dictGroupUpdate, dictGroupUpdateMany, dictGroupDeleteByPk, dictGroupGetSchema];