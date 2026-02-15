import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { userPost, userPostZodSchemas } from '@qiyu-allinai/db/entities/system';

type UserPostSelect = typeof userPost.$inferSelect;
type UserPostInsert = typeof userPost.$inferInsert;

// ============ Filter Schema ============
const userPostFilterSchema = z.object({
  // IN 查询
  userIds: z.array(z.string()).optional(),
  postIds: z.array(z.string()).optional(),
  // 精确匹配
  userId: z.string().optional(),
  postId: z.string().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['userId', 'postId']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: userPostFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const userPostGetByPagination = defineAction({
  meta: { name: 'system.userPost.getByPagination', displayName: '分页查询用户岗位关联', description: '分页查询用户岗位关联列表', tags: ['system', 'userPost'], method: 'POST', path: '/api/system/user-post/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(userPostZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.userIds?.length) conditions.push(inArray(userPost.userId, filter.userIds));
      if (filter.postIds?.length) conditions.push(inArray(userPost.postId, filter.postIds));
      // 精确匹配
      if (filter.userId) conditions.push(eq(userPost.userId, filter.userId));
      if (filter.postId) conditions.push(eq(userPost.postId, filter.postId));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? userPost[sort.field as keyof typeof userPost.$inferSelect] : userPost.userId;
    
    const data = await db.select().from(userPost)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(userPost).where(whereClause);
    return { data: data as UserPostSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const userPostGetByPk = defineAction({
  meta: { name: 'system.userPost.getByPk', displayName: '根据复合主键查询用户岗位关联', description: '根据userId和postId查询', tags: ['system', 'userPost'], method: 'GET', path: '/api/system/user-post/:userId/:postId' },
  schemas: {
    paramsSchema: z.object({ userId: z.string(), postId: z.string() }),
    outputSchema: userPostZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(userPost).where(and(eq(userPost.userId, input.userId), eq(userPost.postId, input.postId))).limit(1);
    return (result as UserPostSelect) ?? null;
  },
});

export const userPostCreate = defineAction({
  meta: { name: 'system.userPost.create', displayName: '创建用户岗位关联', description: '创建单个用户岗位关联', tags: ['system', 'userPost'], method: 'POST', path: '/api/system/user-post' },
  schemas: {
    bodySchema: z.object({ data: userPostZodSchemas.insert }),
    outputSchema: userPostZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(userPost).values(input.data as UserPostInsert).returning();
    return result as UserPostSelect;
  },
});

export const userPostCreateMany = defineAction({
  meta: { name: 'system.userPost.createMany', displayName: '批量创建用户岗位关联', description: '批量创建多个用户岗位关联', tags: ['system', 'userPost'], method: 'POST', path: '/api/system/user-post/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(userPostZodSchemas.insert) }),
    outputSchema: z.array(userPostZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(userPost).values(input.data as UserPostInsert[]).returning();
    return results as UserPostSelect[];
  },
});


export const userPostDeleteByPk = defineAction({
  meta: { name: 'system.userPost.deleteByPk', displayName: '删除用户岗位关联', description: '根据复合主键删除', tags: ['system', 'userPost'], method: 'DELETE', path: '/api/system/user-post/:userId/:postId' },
  schemas: {
    paramsSchema: z.object({ userId: z.string(), postId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(userPost).where(and(eq(userPost.userId, input.userId), eq(userPost.postId, input.postId))).returning();
    return !!result;
  },
});


export const userPostGetSchema = defineAction({
  meta: { name: 'system.userPost.getSchema', ignoreTools: true, displayName: '获取用户岗位Schema', description: '获取用户岗位表的JSON Schema', tags: ['system', 'userPost'], method: 'GET', path: '/api/system/user-post/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(userPostZodSchemas.select) as Record<string, unknown>;
  },
});

export const userPostActions = [userPostGetByPagination, userPostGetByPk, userPostCreate, userPostCreateMany, userPostDeleteByPk, userPostGetSchema];