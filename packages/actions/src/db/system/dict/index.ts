import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { dict, dictZodSchemas } from '@qiyu-allinai/db/entities/system';

type DictSelect = typeof dict.$inferSelect;
type DictInsert = typeof dict.$inferInsert;

// ============ Filter Schema ============
const dictFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.uuid()).optional(),
  groups: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  // 精确匹配
  status: z.enum(['0', '1']).optional(),
  isDefault: z.boolean().optional(),
  // 模糊匹配
  group: z.string().optional(),
  label: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['group', 'label', 'sort', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: dictFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const dictGetByPagination = defineAction({
  meta: { name: 'system.dict.getByPagination', displayName: '分页查询字典', description: '分页查询字典列表，自动排除已删除数据', tags: ['system', 'dict'], method: 'POST', path: '/api/system/dict/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(dictZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [isNull(dict.deletedAt)];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(dict.id, filter.ids));
      if (filter.groups?.length) conditions.push(inArray(dict.group, filter.groups));
      if (filter.labels?.length) conditions.push(inArray(dict.label, filter.labels));
      // 精确匹配
      if (filter.status) conditions.push(eq(dict.status, filter.status));
      if (filter.isDefault !== undefined) conditions.push(eq(dict.isDefault, filter.isDefault));
      // 模糊匹配
      if (filter.group) conditions.push(ilike(dict.group, `%${filter.group}%`));
      if (filter.label) conditions.push(ilike(dict.label, `%${filter.label}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(dict.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(dict.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = and(...conditions);
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? dict[sort.field as keyof typeof dict.$inferSelect] : dict.createdAt;
    
    const data = await db.select().from(dict)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(dict).where(whereClause);
    return { data: data as DictSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const dictGetByPk = defineAction({
  meta: { name: 'system.dict.getByPk', displayName: '根据ID查询字典', description: '根据主键ID查询单个字典', tags: ['system', 'dict'], method: 'GET', path: '/api/system/dict/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: dictZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(dict).where(and(eq(dict.id, input.id), isNull(dict.deletedAt))).limit(1);
    return (result as DictSelect) ?? null;
  },
});

export const dictCreate = defineAction({
  meta: { name: 'system.dict.create', displayName: '创建字典', description: '创建单个字典', tags: ['system', 'dict'], method: 'POST', path: '/api/system/dict' },
  schemas: {
    bodySchema: z.object({ data: dictZodSchemas.insert }),
    outputSchema: dictZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(dict).values(input.data as DictInsert).returning();
    return result as DictSelect;
  },
});


export const dictCreateMany = defineAction({
  meta: { name: 'system.dict.createMany', displayName: '批量创建字典', description: '批量创建多个字典', tags: ['system', 'dict'], method: 'POST', path: '/api/system/dict/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(dictZodSchemas.insert) }),
    outputSchema: z.array(dictZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(dict).values(input.data as DictInsert[]).returning();
    return results as DictSelect[];
  },
});

export const dictUpdate = defineAction({
  meta: { name: 'system.dict.update', displayName: '更新字典', description: '根据ID更新单个字典', tags: ['system', 'dict'], method: 'PUT', path: '/api/system/dict/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: dictZodSchemas.update }),
    outputSchema: dictZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(dict).set(input.data as Partial<DictInsert>).where(and(eq(dict.id, input.id), isNull(dict.deletedAt))).returning();
    return result as DictSelect;
  },
});

export const dictUpdateMany = defineAction({
  meta: { name: 'system.dict.updateMany', displayName: '批量更新字典', description: '根据ID列表批量更新字典', tags: ['system', 'dict'], method: 'PUT', path: '/api/system/dict/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.uuid()), data: dictZodSchemas.update }),
    outputSchema: z.array(dictZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: DictSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(dict).set(input.data as Partial<DictInsert>).where(and(eq(dict.id, id), isNull(dict.deletedAt))).returning();
      if (result) results.push(result as DictSelect);
    }
    return results;
  },
});

export const dictDeleteByPk = defineAction({
  meta: { name: 'system.dict.deleteByPk', displayName: '删除字典', description: '根据ID软删除字典', tags: ['system', 'dict'], method: 'DELETE', path: '/api/system/dict/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const [result] = await db.update(dict).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName
    }).where(and(eq(dict.id, input.id), isNull(dict.deletedAt))).returning();
    return !!result;
  },
});


export const dictGetSchema = defineAction({
  meta: { name: 'system.dict.getSchema', ignoreTools: true, displayName: '获取字典Schema', description: '获取字典表的JSON Schema', tags: ['system', 'dict'], method: 'GET', path: '/api/system/dict/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(dictZodSchemas.select) as Record<string, unknown>;
  },
});

export const dictActions = [dictGetByPagination, dictGetByPk, dictCreate, dictCreateMany, dictUpdate, dictUpdateMany, dictDeleteByPk, dictGetSchema];