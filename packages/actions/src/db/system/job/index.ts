import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { job, jobZodSchemas } from '@qiyu-allinai/db/entities/system';

type JobSelect = typeof job.$inferSelect;
type JobInsert = typeof job.$inferInsert;

// ============ Filter Schema ============
const jobFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.uuid()).optional(),
  names: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  // 精确匹配
  status: z.enum(['0', '1']).optional(),
  concurrent: z.boolean().optional(),
  // 模糊匹配
  name: z.string().optional(),
  group: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'group', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: jobFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const jobGetByPagination = defineAction({
  meta: { name: 'system.job.getByPagination', displayName: '分页查询定时任务', description: '分页查询定时任务列表', tags: ['system', 'job'], method: 'POST', path: '/api/system/job/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(jobZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(job.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(job.name, filter.names));
      if (filter.groups?.length) conditions.push(inArray(job.group, filter.groups));
      // 精确匹配
      if (filter.status) conditions.push(eq(job.status, filter.status));
      if (filter.concurrent !== undefined) conditions.push(eq(job.concurrent, filter.concurrent));
      // 模糊匹配
      if (filter.name) conditions.push(ilike(job.name, `%${filter.name}%`));
      if (filter.group) conditions.push(ilike(job.group, `%${filter.group}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(job.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(job.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? job[sort.field as keyof typeof job.$inferSelect] : job.createdAt;
    
    const data = await db.select().from(job)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(job).where(whereClause);
    return { data: data as JobSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const jobGetByPk = defineAction({
  meta: { name: 'system.job.getByPk', displayName: '根据ID查询定时任务', description: '根据主键ID查询单个定时任务', tags: ['system', 'job'], method: 'GET', path: '/api/system/job/:id' },
  schemas: { paramsSchema: z.object({ id: z.uuid() }), outputSchema: jobZodSchemas.select.nullable() },
  execute: async (input, _context) => { const [result] = await db.select().from(job).where(eq(job.id, input.id)).limit(1); return (result as JobSelect) ?? null; },
});

export const jobCreate = defineAction({
  meta: { name: 'system.job.create', displayName: '创建定时任务', description: '创建单个定时任务', tags: ['system', 'job'], method: 'POST', path: '/api/system/job' },
  schemas: { bodySchema: z.object({ data: jobZodSchemas.insert }), outputSchema: jobZodSchemas.select },
  execute: async (input, _context) => { const [result] = await db.insert(job).values(input.data as JobInsert).returning(); return result as JobSelect; },
});

export const jobCreateMany = defineAction({
  meta: { name: 'system.job.createMany', displayName: '批量创建定时任务', description: '批量创建多个定时任务', tags: ['system', 'job'], method: 'POST', path: '/api/system/job/batch' },
  schemas: { bodySchema: z.object({ data: z.array(jobZodSchemas.insert) }), outputSchema: z.array(jobZodSchemas.select) },
  execute: async (input, _context) => { const results = await db.insert(job).values(input.data as JobInsert[]).returning(); return results as JobSelect[]; },
});


export const jobUpdate = defineAction({
  meta: { name: 'system.job.update', displayName: '更新定时任务', description: '根据ID更新单个定时任务', tags: ['system', 'job'], method: 'PUT', path: '/api/system/job/:id' },
  schemas: { paramsSchema: z.object({ id: z.uuid() }), bodySchema: z.object({ data: jobZodSchemas.update }), outputSchema: jobZodSchemas.select },
  execute: async (input, _context) => { const [result] = await db.update(job).set(input.data as Partial<JobInsert>).where(eq(job.id, input.id)).returning(); return result as JobSelect; },
});

export const jobUpdateMany = defineAction({
  meta: { name: 'system.job.updateMany', displayName: '批量更新定时任务', description: '根据ID列表批量更新定时任务', tags: ['system', 'job'], method: 'PUT', path: '/api/system/job/batch' },
  schemas: { bodySchema: z.object({ ids: z.array(z.uuid()), data: jobZodSchemas.update }), outputSchema: z.array(jobZodSchemas.select) },
  execute: async (input, _context) => { const results: JobSelect[] = []; for (const id of input.ids) { const [result] = await db.update(job).set(input.data as Partial<JobInsert>).where(eq(job.id, id)).returning(); if (result) results.push(result as JobSelect); } return results; },
});

export const jobDeleteByPk = defineAction({
  meta: { name: 'system.job.deleteByPk', displayName: '删除定时任务', description: '根据ID删除定时任务', tags: ['system', 'job'], method: 'DELETE', path: '/api/system/job/:id' },
  schemas: { paramsSchema: z.object({ id: z.uuid() }), outputSchema: z.boolean() },
  execute: async (input, _context) => { const [result] = await db.delete(job).where(eq(job.id, input.id)).returning(); return !!result; },
});


export const jobGetSchema = defineAction({
  meta: { name: 'system.job.getSchema', ignoreTools: true, displayName: '获取定时任务Schema', description: '获取定时任务表的JSON Schema', tags: ['system', 'job'], method: 'GET', path: '/api/system/job/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(jobZodSchemas.select) as Record<string, unknown>;
  },
});

export const jobActions = [jobGetByPagination, jobGetByPk, jobCreate, jobCreateMany, jobUpdate, jobUpdateMany, jobDeleteByPk, jobGetSchema];