import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { toJSONSchema } from '../../../core/schema';
import type { DrizzleDB } from '../../../core/types';
import { role, roleZodSchemas } from '@qiyu-allinai/db/entities/system';

type RoleSelect = typeof role.$inferSelect;
type RoleInsert = typeof role.$inferInsert;

const ADMIN_ROLE_KEY = 'admin';

// 检查是否为管理员角色
async function checkIsAdminRole(db: DrizzleDB, id: string): Promise<boolean> {
  const [result] = await db.select({ key: role.key }).from(role).where(eq(role.id, id)).limit(1);
  return result?.key === ADMIN_ROLE_KEY;
}

// ============ Filter Schema ============
const roleFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  keys: z.array(z.string()).optional(),
  // 精确匹配
  status: z.enum(['0', '1']).optional(),
  // 模糊匹配
  name: z.string().optional(),
  key: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'key', 'sort', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: roleFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const roleGetByPagination = defineAction({
  meta: { name: 'system.role.getByPagination', displayName: '分页查询角色', description: '分页查询角色列表，自动排除已删除数据', tags: ['system', 'role'], method: 'POST', path: '/api/system/role/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(roleZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    
    // Build conditions
    const conditions = [isNull(role.deletedAt)];
    
    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(role.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(role.name, filter.names));
      if (filter.keys?.length) conditions.push(inArray(role.key, filter.keys));
      // 精确匹配
      if (filter.status) conditions.push(eq(role.status, filter.status));
      // 模糊匹配
      if (filter.name) conditions.push(ilike(role.name, `%${filter.name}%`));
      if (filter.key) conditions.push(ilike(role.key, `%${filter.key}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(role.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(role.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = and(...conditions);
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? role[sort.field as keyof typeof role.$inferSelect] : role.createdAt;
    
    const data = await db.select().from(role)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(role).where(whereClause);
    return { data: data as RoleSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const roleGetByPk = defineAction({
  meta: { name: 'system.role.getByPk', displayName: '根据ID查询角色', description: '根据主键ID查询单个角色', tags: ['system', 'role'], method: 'GET', path: '/api/system/role/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: roleZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(role).where(and(eq(role.id, input.id), isNull(role.deletedAt))).limit(1);
    return (result as RoleSelect) ?? null;
  },
});

export const roleCreate = defineAction({
  meta: { name: 'system.role.create', displayName: '创建角色', description: '创建单个角色', tags: ['system', 'role'], method: 'POST', path: '/api/system/role' },
  schemas: {
    bodySchema: z.object({ data: roleZodSchemas.insert }),
    outputSchema: roleZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(role).values(input.data as RoleInsert).returning();
    return result as RoleSelect;
  },
});

export const roleCreateMany = defineAction({
  meta: { name: 'system.role.createMany', displayName: '批量创建角色', description: '批量创建多个角色', tags: ['system', 'role'], method: 'POST', path: '/api/system/role/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(roleZodSchemas.insert) }),
    outputSchema: z.array(roleZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(role).values(input.data as RoleInsert[]).returning();
    return results as RoleSelect[];
  },
});

export const roleUpdate = defineAction({
  meta: { name: 'system.role.update', displayName: '更新角色', description: '根据ID更新单个角色', tags: ['system', 'role'], method: 'PUT', path: '/api/system/role/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: roleZodSchemas.update }),
    outputSchema: roleZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    // 检查是否为管理员角色
    if (await checkIsAdminRole(db, input.id)) {
      throw ActionError.forbidden('error.system.adminRole.cannot.modify');
    }
    const [result] = await db.update(role).set(input.data as Partial<RoleInsert>).where(and(eq(role.id, input.id), isNull(role.deletedAt))).returning();
    return result as RoleSelect;
  },
});

export const roleUpdateMany = defineAction({
  meta: { name: 'system.role.updateMany', displayName: '批量更新角色', description: '根据ID列表批量更新角色', tags: ['system', 'role'], method: 'PUT', path: '/api/system/role/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: roleZodSchemas.update }),
    outputSchema: z.array(roleZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: RoleSelect[] = [];
    for (const id of input.ids) {
      // 检查是否为管理员角色
      if (await checkIsAdminRole(db, id)) {
        throw ActionError.forbidden('error.system.adminRole.cannot.modify');
      }
      const [result] = await db.update(role).set(input.data as Partial<RoleInsert>).where(and(eq(role.id, id), isNull(role.deletedAt))).returning();
      if (result) results.push(result as RoleSelect);
    }
    return results;
  },
});

export const roleDeleteByPk = defineAction({
  meta: { name: 'system.role.deleteByPk', displayName: '删除角色', description: '根据ID软删除角色', tags: ['system', 'role'], method: 'DELETE', path: '/api/system/role/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 检查是否为管理员角色
    if (await checkIsAdminRole(db, input.id)) {
      throw ActionError.forbidden('error.system.adminRole.cannot.delete');
    }
    const [result] = await db.update(role).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName
    }).where(and(eq(role.id, input.id), isNull(role.deletedAt))).returning();
    return !!result;
  },
});


export const roleGetSchema = defineAction({
  meta: { name: 'system.role.getSchema', ignoreTools: true, displayName: '获取角色Schema', description: '获取角色表的JSON Schema', tags: ['system', 'role'], method: 'GET', path: '/api/system/role/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(roleZodSchemas.select) as Record<string, unknown>;
  },
});

export const roleActions = [roleGetByPagination, roleGetByPk, roleCreate, roleCreateMany, roleUpdate, roleUpdateMany, roleDeleteByPk, roleGetSchema];
