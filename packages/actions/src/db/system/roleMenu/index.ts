import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { roleMenu, roleMenuZodSchemas } from '@qiyu-allinai/db/entities/system';

type RoleMenuSelect = typeof roleMenu.$inferSelect;
type RoleMenuInsert = typeof roleMenu.$inferInsert;

// ============ Filter Schema ============
const roleMenuFilterSchema = z.object({
  // IN 查询
  roleIds: z.array(z.string()).optional(),
  menuIds: z.array(z.string()).optional(),
  // 精确匹配
  roleId: z.string().optional(),
  menuId: z.string().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['roleId', 'menuId']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: roleMenuFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const roleMenuGetByPagination = defineAction({
  meta: { name: 'system.roleMenu.getByPagination', displayName: '分页查询角色菜单关联', description: '分页查询角色菜单关联列表', tags: ['system', 'roleMenu'], method: 'POST', path: '/api/system/role-menu/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(roleMenuZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.roleIds?.length) conditions.push(inArray(roleMenu.roleId, filter.roleIds));
      if (filter.menuIds?.length) conditions.push(inArray(roleMenu.menuId, filter.menuIds));
      // 精确匹配
      if (filter.roleId) conditions.push(eq(roleMenu.roleId, filter.roleId));
      if (filter.menuId) conditions.push(eq(roleMenu.menuId, filter.menuId));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? roleMenu[sort.field as keyof typeof roleMenu.$inferSelect] : roleMenu.roleId;
    
    const data = await db.select().from(roleMenu)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(roleMenu).where(whereClause);
    return { data: data as RoleMenuSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const roleMenuGetByPk = defineAction({
  meta: { name: 'system.roleMenu.getByPk', displayName: '根据复合主键查询角色菜单关联', description: '根据roleId和menuId查询', tags: ['system', 'roleMenu'], method: 'GET', path: '/api/system/role-menu/:roleId/:menuId' },
  schemas: {
    paramsSchema: z.object({ roleId: z.string(), menuId: z.string() }),
    outputSchema: roleMenuZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(roleMenu).where(and(eq(roleMenu.roleId, input.roleId), eq(roleMenu.menuId, input.menuId))).limit(1);
    return (result as RoleMenuSelect) ?? null;
  },
});

export const roleMenuCreate = defineAction({
  meta: { name: 'system.roleMenu.create', displayName: '创建角色菜单关联', description: '创建单个角色菜单关联', tags: ['system', 'roleMenu'], method: 'POST', path: '/api/system/role-menu' },
  schemas: {
    bodySchema: z.object({ data: roleMenuZodSchemas.insert }),
    outputSchema: roleMenuZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(roleMenu).values(input.data as RoleMenuInsert).returning();
    return result as RoleMenuSelect;
  },
});

export const roleMenuCreateMany = defineAction({
  meta: { name: 'system.roleMenu.createMany', displayName: '批量创建角色菜单关联', description: '批量创建多个角色菜单关联', tags: ['system', 'roleMenu'], method: 'POST', path: '/api/system/role-menu/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(roleMenuZodSchemas.insert) }),
    outputSchema: z.array(roleMenuZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(roleMenu).values(input.data as RoleMenuInsert[]).returning();
    return results as RoleMenuSelect[];
  },
});


export const roleMenuDeleteByPk = defineAction({
  meta: { name: 'system.roleMenu.deleteByPk', displayName: '删除角色菜单关联', description: '根据复合主键删除', tags: ['system', 'roleMenu'], method: 'DELETE', path: '/api/system/role-menu/:roleId/:menuId' },
  schemas: {
    paramsSchema: z.object({ roleId: z.string(), menuId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(roleMenu).where(and(eq(roleMenu.roleId, input.roleId), eq(roleMenu.menuId, input.menuId))).returning();
    return !!result;
  },
});


export const roleMenuGetSchema = defineAction({
  meta: { name: 'system.roleMenu.getSchema', ignoreTools: true, displayName: '获取角色菜单Schema', description: '获取角色菜单表的JSON Schema', tags: ['system', 'roleMenu'], method: 'GET', path: '/api/system/role-menu/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(roleMenuZodSchemas.select) as Record<string, unknown>;
  },
});

// ============ 获取角色的菜单ID列表 ============
export const roleMenuGetByRoleId = defineAction({
  meta: { name: 'system.roleMenu.getByRoleId', displayName: '获取角色菜单', description: '获取指定角色的所有菜单ID', tags: ['system', 'roleMenu'], method: 'GET', path: '/api/system/role-menu/role/:roleId' },
  schemas: {
    paramsSchema: z.object({ roleId: z.string() }),
    outputSchema: z.array(z.string()),
  },
  execute: async (input, context) => {
    const { db } = context;
    const data = await db.select({ menuId: roleMenu.menuId }).from(roleMenu).where(eq(roleMenu.roleId, input.roleId));
    return data.map(d => d.menuId);
  },
});

// ============ 设置角色的菜单列表（全量替换） ============
export const roleMenuSetByRoleId = defineAction({
  meta: { name: 'system.roleMenu.setByRoleId', displayName: '设置角色菜单', description: '设置指定角色的菜单列表（全量替换）', tags: ['system', 'roleMenu'], method: 'PUT', path: '/api/system/role-menu/role/:roleId' },
  schemas: {
    paramsSchema: z.object({ roleId: z.string() }),
    bodySchema: z.object({ menuIds: z.array(z.string()) }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 删除该角色的所有菜单关联
    await db.delete(roleMenu).where(eq(roleMenu.roleId, input.roleId));
    
    // 插入新的菜单关联
    if (input.menuIds.length > 0) {
      const newRecords: RoleMenuInsert[] = input.menuIds.map(menuId => ({
        roleId: input.roleId,
        menuId,
      }));
      await db.insert(roleMenu).values(newRecords);
    }
    
    return true;
  },
});

export const roleMenuActions = [roleMenuGetByPagination, roleMenuGetByPk, roleMenuCreate, roleMenuCreateMany, roleMenuDeleteByPk, roleMenuGetSchema, roleMenuGetByRoleId, roleMenuSetByRoleId];