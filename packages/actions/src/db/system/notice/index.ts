import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { notice, noticeZodSchemas } from '@qiyu-allinai/db/entities/system';

type NoticeSelect = typeof notice.$inferSelect;
type NoticeInsert = typeof notice.$inferInsert;

// ============ Filter Schema ============
const noticeFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string()).optional(),
  titles: z.array(z.string()).optional(),
  types: z.array(z.string()).optional(),
  // 精确匹配
  type: z.string().optional(),
  status: z.enum(['0', '1']).optional(),
  // 模糊匹配
  title: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['title', 'type', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: noticeFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const noticeGetByPagination = defineAction({
  meta: { name: 'system.notice.getByPagination', displayName: '分页查询通知', description: '分页查询通知列表', tags: ['system', 'notice'], method: 'POST', path: '/api/system/notice/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(noticeZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(notice.id, filter.ids));
      if (filter.titles?.length) conditions.push(inArray(notice.title, filter.titles));
      if (filter.types?.length) conditions.push(inArray(notice.type, filter.types));
      // 精确匹配
      if (filter.type) conditions.push(eq(notice.type, filter.type));
      if (filter.status) conditions.push(eq(notice.status, filter.status));
      // 模糊匹配
      if (filter.title) conditions.push(ilike(notice.title, `%${filter.title}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(notice.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(notice.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? notice[sort.field as keyof typeof notice.$inferSelect] : notice.createdAt;
    
    const data = await db.select().from(notice)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(notice).where(whereClause);
    return { data: data as NoticeSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const noticeGetByPk = defineAction({
  meta: { name: 'system.notice.getByPk', displayName: '根据ID查询通知', description: '根据主键ID查询单个通知', tags: ['system', 'notice'], method: 'GET', path: '/api/system/notice/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: noticeZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(notice).where(eq(notice.id, input.id)).limit(1);
    return (result as NoticeSelect) ?? null;
  },
});

export const noticeCreate = defineAction({
  meta: { name: 'system.notice.create', displayName: '创建通知', description: '创建单个通知', tags: ['system', 'notice'], method: 'POST', path: '/api/system/notice' },
  schemas: {
    bodySchema: z.object({ data: noticeZodSchemas.insert }),
    outputSchema: noticeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(notice).values(input.data as NoticeInsert).returning();
    return result as NoticeSelect;
  },
});


export const noticeCreateMany = defineAction({
  meta: { name: 'system.notice.createMany', displayName: '批量创建通知', description: '批量创建多个通知', tags: ['system', 'notice'], method: 'POST', path: '/api/system/notice/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(noticeZodSchemas.insert) }),
    outputSchema: z.array(noticeZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(notice).values(input.data as NoticeInsert[]).returning();
    return results as NoticeSelect[];
  },
});

export const noticeUpdate = defineAction({
  meta: { name: 'system.notice.update', displayName: '更新通知', description: '根据ID更新单个通知', tags: ['system', 'notice'], method: 'PUT', path: '/api/system/notice/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: noticeZodSchemas.update }),
    outputSchema: noticeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(notice).set(input.data as Partial<NoticeInsert>).where(eq(notice.id, input.id)).returning();
    return result as NoticeSelect;
  },
});

export const noticeUpdateMany = defineAction({
  meta: { name: 'system.notice.updateMany', displayName: '批量更新通知', description: '根据ID列表批量更新通知', tags: ['system', 'notice'], method: 'PUT', path: '/api/system/notice/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: noticeZodSchemas.update }),
    outputSchema: z.array(noticeZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: NoticeSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(notice).set(input.data as Partial<NoticeInsert>).where(eq(notice.id, id)).returning();
      if (result) results.push(result as NoticeSelect);
    }
    return results;
  },
});

export const noticeDeleteByPk = defineAction({
  meta: { name: 'system.notice.deleteByPk', displayName: '删除通知', description: '根据ID删除通知', tags: ['system', 'notice'], method: 'DELETE', path: '/api/system/notice/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(notice).where(eq(notice.id, input.id)).returning();
    return !!result;
  },
});


export const noticeGetSchema = defineAction({
  meta: { name: 'system.notice.getSchema', ignoreTools: true, displayName: '获取通知Schema', description: '获取通知表的JSON Schema', tags: ['system', 'notice'], method: 'GET', path: '/api/system/notice/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(noticeZodSchemas.select) as Record<string, unknown>;
  },
});

export const noticeActions = [noticeGetByPagination, noticeGetByPk, noticeCreate, noticeCreateMany, noticeUpdate, noticeUpdateMany, noticeDeleteByPk, noticeGetSchema];