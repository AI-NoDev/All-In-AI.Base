import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { userRole, userRoleZodSchemas } from '@qiyu-allinai/db/entities/system';

type UserRoleSelect = typeof userRole.$inferSelect;
type UserRoleInsert = typeof userRole.$inferInsert;

// ============ Filter Schema ============
const userRoleFilterSchema = z.object({
  // IN 查询
  userIds: z.array(z.string()).optional(),
  roleIds: z.array(z.string()).optional(),
  // 精确匹配
  userId: z.string().optional(),
  roleId: z.string().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['userId', 'roleId']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: userRoleFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const userRoleGetByPagination = defineAction({
  meta: { name: 'system.userRole.getByPagination', displayName: '分页查询用户角色关联', description: '分页查询用户角色关联列表', tags: ['system', 'userRole'], method: 'POST', path: '/api/system/user-role/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(userRoleZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.userIds?.length) conditions.push(inArray(userRole.userId, filter.userIds));
      if (filter.roleIds?.length) conditions.push(inArray(userRole.roleId, filter.roleIds));
      // 精确匹配
      if (filter.userId) conditions.push(eq(userRole.userId, filter.userId));
      if (filter.roleId) conditions.push(eq(userRole.roleId, filter.roleId));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? userRole[sort.field as keyof typeof userRole.$inferSelect] : userRole.userId;
    
    const data = await db.select().from(userRole)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(userRole).where(whereClause);
    return { data: data as UserRoleSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const userRoleGetByPk = defineAction({
  meta: { name: 'system.userRole.getByPk', displayName: '根据复合主键查询用户角色关联', description: '根据userId和roleId查询', tags: ['system', 'userRole'], method: 'GET', path: '/api/system/user-role/:userId/:roleId' },
  schemas: {
    paramsSchema: z.object({ userId: z.string(), roleId: z.string() }),
    outputSchema: userRoleZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(userRole).where(and(eq(userRole.userId, input.userId), eq(userRole.roleId, input.roleId))).limit(1);
    return (result as UserRoleSelect) ?? null;
  },
});

export const userRoleCreate = defineAction({
  meta: { name: 'system.userRole.create', displayName: '创建用户角色关联', description: '创建单个用户角色关联', tags: ['system', 'userRole'], method: 'POST', path: '/api/system/user-role' },
  schemas: {
    bodySchema: z.object({ data: userRoleZodSchemas.insert }),
    outputSchema: userRoleZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(userRole).values(input.data as UserRoleInsert).returning();
    return result as UserRoleSelect;
  },
});

export const userRoleCreateMany = defineAction({
  meta: { name: 'system.userRole.createMany', displayName: '批量创建用户角色关联', description: '批量创建多个用户角色关联', tags: ['system', 'userRole'], method: 'POST', path: '/api/system/user-role/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(userRoleZodSchemas.insert) }),
    outputSchema: z.array(userRoleZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(userRole).values(input.data as UserRoleInsert[]).returning();
    return results as UserRoleSelect[];
  },
});


export const userRoleDeleteByPk = defineAction({
  meta: { name: 'system.userRole.deleteByPk', displayName: '删除用户角色关联', description: '根据复合主键删除', tags: ['system', 'userRole'], method: 'DELETE', path: '/api/system/user-role/:userId/:roleId' },
  schemas: {
    paramsSchema: z.object({ userId: z.string(), roleId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(userRole).where(and(eq(userRole.userId, input.userId), eq(userRole.roleId, input.roleId))).returning();
    return !!result;
  },
});


export const userRoleGetSchema = defineAction({
  meta: { name: 'system.userRole.getSchema', ignoreTools: true, displayName: '获取用户角色Schema', description: '获取用户角色表的JSON Schema', tags: ['system', 'userRole'], method: 'GET', path: '/api/system/user-role/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(userRoleZodSchemas.select) as Record<string, unknown>;
  },
});

// ============ 获取用户的角色ID列表 ============
export const userRoleGetByUserId = defineAction({
  meta: { name: 'system.userRole.getByUserId', displayName: '获取用户角色', description: '获取指定用户的所有角色ID', tags: ['system', 'userRole'], method: 'GET', path: '/api/system/user-role/user/:userId' },
  schemas: {
    paramsSchema: z.object({ userId: z.string() }),
    outputSchema: z.array(z.string()),
  },
  execute: async (input, _context) => {
    const data = await db.select({ roleId: userRole.roleId }).from(userRole).where(eq(userRole.userId, input.userId));
    return data.map(d => d.roleId);
  },
});

// ============ 设置用户的角色列表（全量替换） ============
export const userRoleSetByUserId = defineAction({
  meta: { name: 'system.userRole.setByUserId', displayName: '设置用户角色', description: '设置指定用户的角色列表（全量替换）', tags: ['system', 'userRole'], method: 'PUT', path: '/api/system/user-role/user/:userId' },
  schemas: {
    paramsSchema: z.object({ userId: z.string() }),
    bodySchema: z.object({ roleIds: z.array(z.string()) }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    // 删除该用户的所有角色关联
    await db.delete(userRole).where(eq(userRole.userId, input.userId));
    
    // 插入新的角色关联
    if (input.roleIds.length > 0) {
      const newRecords: UserRoleInsert[] = input.roleIds.map(roleId => ({
        userId: input.userId,
        roleId,
      }));
      await db.insert(userRole).values(newRecords);
    }
    
    return true;
  },
});

export const userRoleActions = [userRoleGetByPagination, userRoleGetByPk, userRoleCreate, userRoleCreateMany, userRoleDeleteByPk, userRoleGetSchema, userRoleGetByUserId, userRoleSetByUserId];