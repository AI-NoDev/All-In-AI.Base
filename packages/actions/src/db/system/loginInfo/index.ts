import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { loginInfo, loginInfoZodSchemas } from '@qiyu-allinai/db/entities/system';

type LoginInfoSelect = typeof loginInfo.$inferSelect;
type LoginInfoInsert = typeof loginInfo.$inferInsert;

// ============ Filter Schema ============
const loginInfoFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.uuid()).optional(),
  loginNames: z.array(z.string()).optional(),
  // 精确匹配
  status: z.enum(['0', '1']).optional(),
  // 模糊匹配
  loginName: z.string().optional(),
  ipaddr: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
  loginTimeStart: z.iso.datetime().optional(),
  loginTimeEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['loginName', 'ipaddr', 'loginTime', 'createdAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: loginInfoFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const loginInfoGetByPagination = defineAction({
  meta: { name: 'system.loginInfo.getByPagination', displayName: '分页查询登录日志', description: '分页查询登录日志列表', tags: ['system', 'loginInfo'], method: 'POST', path: '/api/system/login-info/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(loginInfoZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(loginInfo.id, filter.ids));
      if (filter.loginNames?.length) conditions.push(inArray(loginInfo.loginName, filter.loginNames));
      // 精确匹配
      if (filter.status) conditions.push(eq(loginInfo.status, filter.status));
      // 模糊匹配
      if (filter.loginName) conditions.push(ilike(loginInfo.loginName, `%${filter.loginName}%`));
      if (filter.ipaddr) conditions.push(ilike(loginInfo.ipaddr, `%${filter.ipaddr}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(loginInfo.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(loginInfo.createdAt, filter.createdAtEnd));
      if (filter.loginTimeStart) conditions.push(gte(loginInfo.loginTime, new Date(filter.loginTimeStart)));
      if (filter.loginTimeEnd) conditions.push(lte(loginInfo.loginTime, new Date(filter.loginTimeEnd)));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? loginInfo[sort.field as keyof typeof loginInfo.$inferSelect] : loginInfo.createdAt;
    
    const data = await db.select().from(loginInfo)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(loginInfo).where(whereClause);
    return { data: data as LoginInfoSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const loginInfoGetByPk = defineAction({
  meta: { name: 'system.loginInfo.getByPk', displayName: '根据ID查询登录日志', description: '根据主键ID查询单个登录日志', tags: ['system', 'loginInfo'], method: 'GET', path: '/api/system/login-info/:id' },
  schemas: { paramsSchema: z.object({ id: z.uuid() }), outputSchema: loginInfoZodSchemas.select.nullable() },
  execute: async (input, _context) => { const [result] = await db.select().from(loginInfo).where(eq(loginInfo.id, input.id)).limit(1); return (result as LoginInfoSelect) ?? null; },
});

export const loginInfoCreate = defineAction({
  meta: { name: 'system.loginInfo.create', displayName: '创建登录日志', description: '创建单个登录日志', tags: ['system', 'loginInfo'], method: 'POST', path: '/api/system/login-info' },
  schemas: { bodySchema: z.object({ data: loginInfoZodSchemas.insert }), outputSchema: loginInfoZodSchemas.select },
  execute: async (input, _context) => { const [result] = await db.insert(loginInfo).values(input.data as LoginInfoInsert).returning(); return result as LoginInfoSelect; },
});

export const loginInfoDeleteByPk = defineAction({
  meta: { name: 'system.loginInfo.deleteByPk', displayName: '删除登录日志', description: '根据ID删除登录日志', tags: ['system', 'loginInfo'], method: 'DELETE', path: '/api/system/login-info/:id' },
  schemas: { paramsSchema: z.object({ id: z.uuid() }), outputSchema: z.boolean() },
  execute: async (input, _context) => { const [result] = await db.delete(loginInfo).where(eq(loginInfo.id, input.id)).returning(); return !!result; },
});


export const loginInfoGetSchema = defineAction({
  meta: { name: 'system.loginInfo.getSchema', ignoreTools: true, displayName: '获取登录信息Schema', description: '获取登录信息表的JSON Schema', tags: ['system', 'loginInfo'], method: 'GET', path: '/api/system/login-info/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(loginInfoZodSchemas.select) as Record<string, unknown>;
  },
});

export const loginInfoActions = [loginInfoGetByPagination, loginInfoGetByPk, loginInfoCreate, loginInfoDeleteByPk, loginInfoGetSchema];