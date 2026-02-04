import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { operationLog, operationLogZodSchemas } from '@qiyu-allinai/db/entities/system';

type OperationLogSelect = typeof operationLog.$inferSelect;
type OperationLogInsert = typeof operationLog.$inferInsert;

// ============ Filter Schema ============
const operationLogFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.uuid()).optional(),
  titles: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  // 精确匹配
  status: z.enum(['0', '1']).optional(),
  // 模糊匹配
  title: z.string().optional(),
  name: z.string().optional(),
  // 时间范围
  timeStart: z.iso.datetime().optional(),
  timeEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['title', 'name', 'time']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: operationLogFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const operationLogGetByPagination = defineAction({
  meta: { name: 'system.operationLog.getByPagination', displayName: '分页查询操作日志', description: '分页查询操作日志列表', tags: ['system', 'operationLog'], method: 'POST', path: '/api/system/operation-log/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(operationLogZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(operationLog.id, filter.ids));
      if (filter.titles?.length) conditions.push(inArray(operationLog.title, filter.titles));
      if (filter.names?.length) conditions.push(inArray(operationLog.name, filter.names));
      // 精确匹配
      if (filter.status) conditions.push(eq(operationLog.status, filter.status));
      // 模糊匹配
      if (filter.title) conditions.push(ilike(operationLog.title, `%${filter.title}%`));
      if (filter.name) conditions.push(ilike(operationLog.name, `%${filter.name}%`));
      // 时间范围
      if (filter.timeStart) conditions.push(gte(operationLog.time, new Date(filter.timeStart)));
      if (filter.timeEnd) conditions.push(lte(operationLog.time, new Date(filter.timeEnd)));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? operationLog[sort.field as keyof typeof operationLog.$inferSelect] : operationLog.time;
    
    const data = await db.select().from(operationLog)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(operationLog).where(whereClause);
    return { data: data as OperationLogSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const operationLogGetByPk = defineAction({
  meta: { name: 'system.operationLog.getByPk', displayName: '根据ID查询操作日志', description: '根据主键ID查询单个操作日志', tags: ['system', 'operationLog'], method: 'GET', path: '/api/system/operation-log/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: operationLogZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(operationLog).where(eq(operationLog.id, input.id)).limit(1);
    return (result as OperationLogSelect) ?? null;
  },
});

export const operationLogCreate = defineAction({
  meta: { name: 'system.operationLog.create', displayName: '创建操作日志', description: '创建单个操作日志', tags: ['system', 'operationLog'], method: 'POST', path: '/api/system/operation-log' },
  schemas: {
    bodySchema: z.object({ data: operationLogZodSchemas.insert }),
    outputSchema: operationLogZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(operationLog).values(input.data as OperationLogInsert).returning();
    return result as OperationLogSelect;
  },
});

export const operationLogDeleteByPk = defineAction({
  meta: { name: 'system.operationLog.deleteByPk', displayName: '删除操作日志', description: '根据ID删除操作日志', tags: ['system', 'operationLog'], method: 'DELETE', path: '/api/system/operation-log/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(operationLog).where(eq(operationLog.id, input.id)).returning();
    return !!result;
  },
});


export const operationLogGetSchema = defineAction({
  meta: { name: 'system.operationLog.getSchema', ignoreTools: true, displayName: '获取操作日志Schema', description: '获取操作日志表的JSON Schema', tags: ['system', 'operationLog'], method: 'GET', path: '/api/system/operation-log/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(operationLogZodSchemas.select) as Record<string, unknown>;
  },
});

export const operationLogActions = [operationLogGetByPagination, operationLogGetByPk, operationLogCreate, operationLogDeleteByPk, operationLogGetSchema];