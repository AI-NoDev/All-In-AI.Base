import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { toolGroup, toolGroupZodSchemas } from '@qiyu-allinai/db/entities/ai';

type ToolGroupSelect = typeof toolGroup.$inferSelect;
type ToolGroupInsert = typeof toolGroup.$inferInsert;

// ============ Filter Schema ============
const toolGroupFilterSchema = z.object({
  ids: z.array(z.uuid()).optional(),
  names: z.array(z.string()).optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'orderNum', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: toolGroupFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const toolGroupGetByPagination = defineAction({
  meta: { name: 'ai.toolGroup.getByPagination', displayName: '分页查询工具组', description: '分页查询工具组列表', tags: ['ai', 'toolGroup'], method: 'POST', path: '/api/ai/tool-group/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(toolGroupZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(toolGroup.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(toolGroup.name, filter.names));
      if (filter.name) conditions.push(ilike(toolGroup.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(toolGroup.status, filter.status));
      if (filter.createdAtStart) conditions.push(gte(toolGroup.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(toolGroup.createdAt, filter.createdAtEnd));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? toolGroup[sort.field as keyof typeof toolGroup.$inferSelect] : toolGroup.createdAt;
    const data = await db.select().from(toolGroup).where(whereClause).orderBy(orderFn(sortColumn as any)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(toolGroup).where(whereClause);
    return { data: data as ToolGroupSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const toolGroupGetByPk = defineAction({
  meta: { name: 'ai.toolGroup.getByPk', displayName: '根据ID查询工具组', description: '根据主键ID查询单个工具组', tags: ['ai', 'toolGroup'], method: 'GET', path: '/api/ai/tool-group/:id' },
  schemas: { paramsSchema: z.object({ id: z.uuid() }), outputSchema: toolGroupZodSchemas.select.nullable() },
  execute: async (input, _context) => {
    const [result] = await db.select().from(toolGroup).where(eq(toolGroup.id, input.id)).limit(1);
    return (result as ToolGroupSelect) ?? null;
  },
});

export const toolGroupCreate = defineAction({
  meta: { name: 'ai.toolGroup.create', displayName: '创建工具组', description: '创建单个工具组', tags: ['ai', 'toolGroup'], method: 'POST', path: '/api/ai/tool-group' },
  schemas: { bodySchema: z.object({ data: toolGroupZodSchemas.insert }), outputSchema: toolGroupZodSchemas.select },
  execute: async (input, _context) => {
    const [result] = await db.insert(toolGroup).values(input.data as ToolGroupInsert).returning();
    return result as ToolGroupSelect;
  },
});

export const toolGroupCreateMany = defineAction({
  meta: { name: 'ai.toolGroup.createMany', displayName: '批量创建工具组', description: '批量创建多个工具组', tags: ['ai', 'toolGroup'], method: 'POST', path: '/api/ai/tool-group/batch' },
  schemas: { bodySchema: z.object({ data: z.array(toolGroupZodSchemas.insert) }), outputSchema: z.array(toolGroupZodSchemas.select) },
  execute: async (input, _context) => {
    const results = await db.insert(toolGroup).values(input.data as ToolGroupInsert[]).returning();
    return results as ToolGroupSelect[];
  },
});

export const toolGroupUpdate = defineAction({
  meta: { name: 'ai.toolGroup.update', displayName: '更新工具组', description: '根据ID更新单个工具组', tags: ['ai', 'toolGroup'], method: 'PUT', path: '/api/ai/tool-group/:id' },
  schemas: { paramsSchema: z.object({ id: z.uuid() }), bodySchema: z.object({ data: toolGroupZodSchemas.update }), outputSchema: toolGroupZodSchemas.select },
  execute: async (input, _context) => {
    const [result] = await db.update(toolGroup).set(input.data as Partial<ToolGroupInsert>).where(eq(toolGroup.id, input.id)).returning();
    return result as ToolGroupSelect;
  },
});

export const toolGroupUpdateMany = defineAction({
  meta: { name: 'ai.toolGroup.updateMany', displayName: '批量更新工具组', description: '根据ID列表批量更新工具组', tags: ['ai', 'toolGroup'], method: 'PUT', path: '/api/ai/tool-group/batch' },
  schemas: { bodySchema: z.object({ ids: z.array(z.uuid()), data: toolGroupZodSchemas.update }), outputSchema: z.array(toolGroupZodSchemas.select) },
  execute: async (input, _context) => {
    const results: ToolGroupSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(toolGroup).set(input.data as Partial<ToolGroupInsert>).where(eq(toolGroup.id, id)).returning();
      if (result) results.push(result as ToolGroupSelect);
    }
    return results;
  },
});

export const toolGroupDeleteByPk = defineAction({
  meta: { name: 'ai.toolGroup.deleteByPk', displayName: '删除工具组', description: '根据ID删除工具组', tags: ['ai', 'toolGroup'], method: 'DELETE', path: '/api/ai/tool-group/:id' },
  schemas: { paramsSchema: z.object({ id: z.uuid() }), outputSchema: z.boolean() },
  execute: async (input, _context) => {
    const [result] = await db.delete(toolGroup).where(eq(toolGroup.id, input.id)).returning();
    return !!result;
  },
});


export const toolGroupGetSchema = defineAction({
  meta: { name: 'ai.toolGroup.getSchema', ignoreTools: true, displayName: '获取工具组Schema', description: '获取工具组表的JSON Schema', tags: ['ai', 'toolGroup'], method: 'GET', path: '/api/ai/tool-group/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(toolGroupZodSchemas.select) as Record<string, unknown>;
  },
});

export const toolGroupActions = [toolGroupGetByPagination, toolGroupGetByPk, toolGroupCreate, toolGroupCreateMany, toolGroupUpdate, toolGroupUpdateMany, toolGroupDeleteByPk, toolGroupGetSchema];
