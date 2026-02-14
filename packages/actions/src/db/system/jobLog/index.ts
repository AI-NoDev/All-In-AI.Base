import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { jobLog, jobLogZodSchemas } from '@qiyu-allinai/db/entities/system';

type JobLogSelect = typeof jobLog.$inferSelect;
type JobLogInsert = typeof jobLog.$inferInsert;

// ============ Filter Schema ============
const jobLogFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string()).optional(),
  jobNames: z.array(z.string()).optional(),
  jobGroups: z.array(z.string()).optional(),
  // 精确匹配
  status: z.enum(['0', '1']).optional(),
  // 模糊匹配
  jobName: z.string().optional(),
  jobGroup: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
  startTimeStart: z.iso.datetime().optional(),
  startTimeEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['jobName', 'jobGroup', 'startTime', 'stopTime', 'createdAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: jobLogFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const jobLogGetByPagination = defineAction({
  meta: { name: 'system.jobLog.getByPagination', displayName: '分页查询任务日志', description: '分页查询任务日志列表', tags: ['system', 'jobLog'], method: 'POST', path: '/api/system/job-log/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(jobLogZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(jobLog.id, filter.ids));
      if (filter.jobNames?.length) conditions.push(inArray(jobLog.jobName, filter.jobNames));
      if (filter.jobGroups?.length) conditions.push(inArray(jobLog.jobGroup, filter.jobGroups));
      // 精确匹配
      if (filter.status) conditions.push(eq(jobLog.status, filter.status));
      // 模糊匹配
      if (filter.jobName) conditions.push(ilike(jobLog.jobName, `%${filter.jobName}%`));
      if (filter.jobGroup) conditions.push(ilike(jobLog.jobGroup, `%${filter.jobGroup}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(jobLog.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(jobLog.createdAt, filter.createdAtEnd));
      if (filter.startTimeStart) conditions.push(gte(jobLog.startTime, new Date(filter.startTimeStart)));
      if (filter.startTimeEnd) conditions.push(lte(jobLog.startTime, new Date(filter.startTimeEnd)));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? jobLog[sort.field as keyof typeof jobLog.$inferSelect] : jobLog.createdAt;
    
    const data = await db.select().from(jobLog)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(jobLog).where(whereClause);
    return { data: data as JobLogSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const jobLogGetByPk = defineAction({
  meta: { name: 'system.jobLog.getByPk', displayName: '根据ID查询任务日志', description: '根据主键ID查询单个任务日志', tags: ['system', 'jobLog'], method: 'GET', path: '/api/system/job-log/:id' },
  schemas: { paramsSchema: z.object({ id: z.string() }), outputSchema: jobLogZodSchemas.select.nullable() },
  execute: async (input, _context) => { const [result] = await db.select().from(jobLog).where(eq(jobLog.id, input.id)).limit(1); return (result as JobLogSelect) ?? null; },
});

export const jobLogCreate = defineAction({
  meta: { name: 'system.jobLog.create', displayName: '创建任务日志', description: '创建单个任务日志', tags: ['system', 'jobLog'], method: 'POST', path: '/api/system/job-log' },
  schemas: { bodySchema: z.object({ data: jobLogZodSchemas.insert }), outputSchema: jobLogZodSchemas.select },
  execute: async (input, _context) => { const [result] = await db.insert(jobLog).values(input.data as JobLogInsert).returning(); return result as JobLogSelect; },
});

export const jobLogCreateMany = defineAction({
  meta: { name: 'system.jobLog.createMany', displayName: '批量创建任务日志', description: '批量创建多个任务日志', tags: ['system', 'jobLog'], method: 'POST', path: '/api/system/job-log/batch' },
  schemas: { bodySchema: z.object({ data: z.array(jobLogZodSchemas.insert) }), outputSchema: z.array(jobLogZodSchemas.select) },
  execute: async (input, _context) => { const results = await db.insert(jobLog).values(input.data as JobLogInsert[]).returning(); return results as JobLogSelect[]; },
});


export const jobLogUpdate = defineAction({
  meta: { name: 'system.jobLog.update', displayName: '更新任务日志', description: '根据ID更新单个任务日志', tags: ['system', 'jobLog'], method: 'PUT', path: '/api/system/job-log/:id' },
  schemas: { paramsSchema: z.object({ id: z.string() }), bodySchema: z.object({ data: jobLogZodSchemas.update }), outputSchema: jobLogZodSchemas.select },
  execute: async (input, _context) => { const [result] = await db.update(jobLog).set(input.data as Partial<JobLogInsert>).where(eq(jobLog.id, input.id)).returning(); return result as JobLogSelect; },
});

export const jobLogUpdateMany = defineAction({
  meta: { name: 'system.jobLog.updateMany', displayName: '批量更新任务日志', description: '根据ID列表批量更新任务日志', tags: ['system', 'jobLog'], method: 'PUT', path: '/api/system/job-log/batch' },
  schemas: { bodySchema: z.object({ ids: z.array(z.string()), data: jobLogZodSchemas.update }), outputSchema: z.array(jobLogZodSchemas.select) },
  execute: async (input, _context) => { const results: JobLogSelect[] = []; for (const id of input.ids) { const [result] = await db.update(jobLog).set(input.data as Partial<JobLogInsert>).where(eq(jobLog.id, id)).returning(); if (result) results.push(result as JobLogSelect); } return results; },
});

export const jobLogDeleteByPk = defineAction({
  meta: { name: 'system.jobLog.deleteByPk', displayName: '删除任务日志', description: '根据ID删除任务日志', tags: ['system', 'jobLog'], method: 'DELETE', path: '/api/system/job-log/:id' },
  schemas: { paramsSchema: z.object({ id: z.string() }), outputSchema: z.boolean() },
  execute: async (input, _context) => { const [result] = await db.delete(jobLog).where(eq(jobLog.id, input.id)).returning(); return !!result; },
});


export const jobLogGetSchema = defineAction({
  meta: { name: 'system.jobLog.getSchema', ignoreTools: true, displayName: '获取任务日志Schema', description: '获取任务日志表的JSON Schema', tags: ['system', 'jobLog'], method: 'GET', path: '/api/system/job-log/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(jobLogZodSchemas.select) as Record<string, unknown>;
  },
});

export const jobLogActions = [jobLogGetByPagination, jobLogGetByPk, jobLogCreate, jobLogCreateMany, jobLogUpdate, jobLogUpdateMany, jobLogDeleteByPk, jobLogGetSchema];