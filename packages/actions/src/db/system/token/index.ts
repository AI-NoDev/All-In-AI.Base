import { z } from 'zod';
import { eq, sql, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { token, tokenZodSchemas } from '@qiyu-allinai/db/entities/system';

type TokenSelect = typeof token.$inferSelect;
type TokenInsert = typeof token.$inferInsert;

// ============ Filter Schema ============
const tokenFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string()).optional(),
  userIds: z.array(z.string()).optional(),
  // 精确匹配
  userId: z.string().optional(),
  isRevoked: z.boolean().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
  expStart: z.iso.datetime().optional(),
  expEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['createdAt', 'exp', 'iat']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: tokenFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const tokenGetByPagination = defineAction({
  meta: { name: 'system.token.getByPagination', displayName: '分页查询令牌', description: '分页查询令牌列表', tags: ['system', 'token'], method: 'POST', path: '/api/system/token/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(tokenZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(token.id, filter.ids));
      if (filter.userIds?.length) conditions.push(inArray(token.userId, filter.userIds));
      // 精确匹配
      if (filter.userId) conditions.push(eq(token.userId, filter.userId));
      if (filter.isRevoked !== undefined) conditions.push(eq(token.isRevoked, filter.isRevoked));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(token.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(token.createdAt, filter.createdAtEnd));
      if (filter.expStart) conditions.push(gte(token.exp, filter.expStart));
      if (filter.expEnd) conditions.push(lte(token.exp, filter.expEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? token[sort.field as keyof typeof token.$inferSelect] : token.createdAt;
    
    const data = await db.select().from(token)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(token).where(whereClause);
    return { data: data as TokenSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const tokenGetByPk = defineAction({
  meta: { name: 'system.token.getByPk', displayName: '根据ID查询令牌', description: '根据主键ID查询单个令牌', tags: ['system', 'token'], method: 'GET', path: '/api/system/token/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: tokenZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(token).where(eq(token.id, input.id)).limit(1);
    return (result as TokenSelect) ?? null;
  },
});

export const tokenCreate = defineAction({
  meta: { name: 'system.token.create', displayName: '创建令牌', description: '创建单个令牌', tags: ['system', 'token'], method: 'POST', path: '/api/system/token' },
  schemas: {
    bodySchema: z.object({ data: tokenZodSchemas.insert }),
    outputSchema: tokenZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(token).values(input.data as TokenInsert).returning();
    return result as TokenSelect;
  },
});


export const tokenUpdate = defineAction({
  meta: { name: 'system.token.update', displayName: '更新令牌', description: '根据ID更新单个令牌', tags: ['system', 'token'], method: 'PUT', path: '/api/system/token/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: tokenZodSchemas.update }),
    outputSchema: tokenZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(token).set(input.data as Partial<TokenInsert>).where(eq(token.id, input.id)).returning();
    return result as TokenSelect;
  },
});

export const tokenDeleteByPk = defineAction({
  meta: { name: 'system.token.deleteByPk', displayName: '删除令牌', description: '根据ID删除令牌', tags: ['system', 'token'], method: 'DELETE', path: '/api/system/token/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(token).where(eq(token.id, input.id)).returning();
    return !!result;
  },
});


export const tokenGetSchema = defineAction({
  meta: { name: 'system.token.getSchema', ignoreTools: true, displayName: '获取TokenSchema', description: '获取Token表的JSON Schema', tags: ['system', 'token'], method: 'GET', path: '/api/system/token/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(tokenZodSchemas.select) as Record<string, unknown>;
  },
});

export const tokenActions = [tokenGetByPagination, tokenGetByPk, tokenCreate, tokenUpdate, tokenDeleteByPk, tokenGetSchema];