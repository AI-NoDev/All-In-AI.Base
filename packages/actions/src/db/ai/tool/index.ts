import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { tool, toolZodSchemas } from '@qiyu-allinai/db/entities/ai';

type ToolSelect = typeof tool.$inferSelect;
type ToolInsert = typeof tool.$inferInsert;

// ============ Filter Schema ============
const toolFilterSchema = z.object({
  ids: z.array(z.uuid()).optional(),
  names: z.array(z.string()).optional(),
  groupId: z.uuid().optional(),
  groupIds: z.array(z.uuid()).optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  isAsync: z.boolean().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: toolFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const toolGetByPagination = defineAction({
  meta: { name: 'ai.tool.getByPagination', displayName: '分页查询工具', description: '分页查询工具列表', tags: ['ai', 'tool'], method: 'POST', path: '/api/ai/tool/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(toolZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(tool.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(tool.name, filter.names));
      if (filter.groupId) conditions.push(eq(tool.groupId, filter.groupId));
      if (filter.groupIds?.length) conditions.push(inArray(tool.groupId, filter.groupIds));
      if (filter.name) conditions.push(ilike(tool.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(tool.status, filter.status));
      if (filter.isAsync !== undefined) conditions.push(eq(tool.isAsync, filter.isAsync));
      if (filter.createdAtStart) conditions.push(gte(tool.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(tool.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? tool[sort.field as keyof typeof tool.$inferSelect] : tool.createdAt;
    
    const data = await db.select().from(tool).where(whereClause).orderBy(orderFn(sortColumn as any)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(tool).where(whereClause);
    return { data: data as ToolSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const toolGetByPk = defineAction({
  meta: { name: 'ai.tool.getByPk', displayName: '根据ID查询工具', description: '根据主键ID查询单个工具', tags: ['ai', 'tool'], method: 'GET', path: '/api/ai/tool/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: toolZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(tool).where(eq(tool.id, input.id)).limit(1);
    return (result as ToolSelect) ?? null;
  },
});

export const toolCreate = defineAction({
  meta: { name: 'ai.tool.create', displayName: '创建工具', description: '创建单个工具', tags: ['ai', 'tool'], method: 'POST', path: '/api/ai/tool' },
  schemas: {
    bodySchema: z.object({ data: toolZodSchemas.insert }),
    outputSchema: toolZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(tool).values(input.data as ToolInsert).returning();
    return result as ToolSelect;
  },
});

export const toolCreateMany = defineAction({
  meta: { name: 'ai.tool.createMany', displayName: '批量创建工具', description: '批量创建多个工具', tags: ['ai', 'tool'], method: 'POST', path: '/api/ai/tool/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(toolZodSchemas.insert) }),
    outputSchema: z.array(toolZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(tool).values(input.data as ToolInsert[]).returning();
    return results as ToolSelect[];
  },
});

export const toolUpdate = defineAction({
  meta: { name: 'ai.tool.update', displayName: '更新工具', description: '根据ID更新单个工具', tags: ['ai', 'tool'], method: 'PUT', path: '/api/ai/tool/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: toolZodSchemas.update }),
    outputSchema: toolZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(tool).set(input.data as Partial<ToolInsert>).where(eq(tool.id, input.id)).returning();
    return result as ToolSelect;
  },
});

export const toolUpdateMany = defineAction({
  meta: { name: 'ai.tool.updateMany', displayName: '批量更新工具', description: '根据ID列表批量更新工具', tags: ['ai', 'tool'], method: 'PUT', path: '/api/ai/tool/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.uuid()), data: toolZodSchemas.update }),
    outputSchema: z.array(toolZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: ToolSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(tool).set(input.data as Partial<ToolInsert>).where(eq(tool.id, id)).returning();
      if (result) results.push(result as ToolSelect);
    }
    return results;
  },
});

export const toolDeleteByPk = defineAction({
  meta: { name: 'ai.tool.deleteByPk', displayName: '删除工具', description: '根据ID删除工具', tags: ['ai', 'tool'], method: 'DELETE', path: '/api/ai/tool/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(tool).where(eq(tool.id, input.id)).returning();
    return !!result;
  },
});


export const toolGetSchema = defineAction({
  meta: { name: 'ai.tool.getSchema', ignoreTools: true, displayName: '获取AI工具Schema', description: '获取AI工具表的JSON Schema', tags: ['ai', 'tool'], method: 'GET', path: '/api/ai/tool/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(toolZodSchemas.select) as Record<string, unknown>;
  },
});

export const toolActions = [toolGetByPagination, toolGetByPk, toolCreate, toolCreateMany, toolUpdate, toolUpdateMany, toolDeleteByPk, toolGetSchema];
