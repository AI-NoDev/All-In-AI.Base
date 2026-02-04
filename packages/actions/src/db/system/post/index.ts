import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { post, postZodSchemas } from '@qiyu-allinai/db/entities/system';

type PostSelect = typeof post.$inferSelect;
type PostInsert = typeof post.$inferInsert;

// ============ Filter Schema ============
const postFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.uuid()).optional(),
  codes: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  // 精确匹配
  status: z.enum(['0', '1']).optional(),
  // 模糊匹配
  code: z.string().optional(),
  name: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['code', 'name', 'sort', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: postFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const postGetByPagination = defineAction({
  meta: { name: 'system.post.getByPagination', displayName: '分页查询岗位', description: '分页查询岗位列表', tags: ['system', 'post'], method: 'POST', path: '/api/system/post/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(postZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [isNull(post.deletedAt)];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(post.id, filter.ids));
      if (filter.codes?.length) conditions.push(inArray(post.code, filter.codes));
      if (filter.names?.length) conditions.push(inArray(post.name, filter.names));
      // 精确匹配
      if (filter.status) conditions.push(eq(post.status, filter.status));
      // 模糊匹配
      if (filter.code) conditions.push(ilike(post.code, `%${filter.code}%`));
      if (filter.name) conditions.push(ilike(post.name, `%${filter.name}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(post.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(post.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = and(...conditions);
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? post[sort.field as keyof typeof post.$inferSelect] : post.createdAt;
    
    const data = await db.select().from(post)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(post).where(whereClause);
    return { data: data as PostSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const postGetByPk = defineAction({
  meta: { name: 'system.post.getByPk', displayName: '根据ID查询岗位', description: '根据主键ID查询单个岗位', tags: ['system', 'post'], method: 'GET', path: '/api/system/post/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: postZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(post).where(and(eq(post.id, input.id), isNull(post.deletedAt))).limit(1);
    return (result as PostSelect) ?? null;
  },
});

export const postCreate = defineAction({
  meta: { name: 'system.post.create', displayName: '创建岗位', description: '创建单个岗位', tags: ['system', 'post'], method: 'POST', path: '/api/system/post' },
  schemas: {
    bodySchema: z.object({ data: postZodSchemas.insert }),
    outputSchema: postZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(post).values(input.data as PostInsert).returning();
    return result as PostSelect;
  },
});


export const postCreateMany = defineAction({
  meta: { name: 'system.post.createMany', displayName: '批量创建岗位', description: '批量创建多个岗位', tags: ['system', 'post'], method: 'POST', path: '/api/system/post/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(postZodSchemas.insert) }),
    outputSchema: z.array(postZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(post).values(input.data as PostInsert[]).returning();
    return results as PostSelect[];
  },
});

export const postUpdate = defineAction({
  meta: { name: 'system.post.update', displayName: '更新岗位', description: '根据ID更新单个岗位', tags: ['system', 'post'], method: 'PUT', path: '/api/system/post/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: postZodSchemas.update }),
    outputSchema: postZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(post).set(input.data as Partial<PostInsert>).where(and(eq(post.id, input.id), isNull(post.deletedAt))).returning();
    return result as PostSelect;
  },
});

export const postUpdateMany = defineAction({
  meta: { name: 'system.post.updateMany', displayName: '批量更新岗位', description: '根据ID列表批量更新岗位', tags: ['system', 'post'], method: 'PUT', path: '/api/system/post/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.uuid()), data: postZodSchemas.update }),
    outputSchema: z.array(postZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: PostSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(post).set(input.data as Partial<PostInsert>).where(and(eq(post.id, id), isNull(post.deletedAt))).returning();
      if (result) results.push(result as PostSelect);
    }
    return results;
  },
});

export const postDeleteByPk = defineAction({
  meta: { name: 'system.post.deleteByPk', displayName: '删除岗位', description: '根据ID软删除岗位', tags: ['system', 'post'], method: 'DELETE', path: '/api/system/post/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const [result] = await db.update(post).set({
      deletedAt: new Date().toISOString(),
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName,
    }).where(and(eq(post.id, input.id), isNull(post.deletedAt))).returning();
    return !!result;
  },
});


export const postGetSchema = defineAction({
  meta: { name: 'system.post.getSchema', ignoreTools: true, displayName: '获取岗位Schema', description: '获取岗位表的JSON Schema', tags: ['system', 'post'], method: 'GET', path: '/api/system/post/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(postZodSchemas.select) as Record<string, unknown>;
  },
});

export const postActions = [postGetByPagination, postGetByPk, postCreate, postCreateMany, postUpdate, postUpdateMany, postDeleteByPk, postGetSchema];