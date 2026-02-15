import { z } from 'zod';
import { eq, sql, ilike, and, isNull, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { menu, menuZodSchemas } from '@qiyu-allinai/db/entities/system';

type MenuSelect = typeof menu.$inferSelect;
type MenuInsert = typeof menu.$inferInsert;

// ============ Filter Schema ============
const menuFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  types: z.array(z.string()).optional(),
  // 精确匹配
  parentId: z.string().nullable().optional(),
  type: z.string().optional(),
  visible: z.boolean().optional(),
  // 模糊匹配
  name: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'orderNum', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: menuFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const menuGetByPagination = defineAction({
  meta: { name: 'system.menu.getByPagination', displayName: '分页查询菜单', description: '分页查询菜单列表', tags: ['system', 'menu'], method: 'POST', path: '/api/system/menu/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(menuZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(menu.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(menu.name, filter.names));
      if (filter.types?.length) conditions.push(inArray(menu.type, filter.types));
      // 精确匹配
      if (filter.parentId === null) { conditions.push(isNull(menu.parentId)); } else if (filter.parentId) { conditions.push(eq(menu.parentId, filter.parentId)); }
      if (filter.type) conditions.push(eq(menu.type, filter.type));
      if (filter.visible !== undefined) conditions.push(eq(menu.visible, filter.visible));
      // 模糊匹配
      if (filter.name) conditions.push(ilike(menu.name, `%${filter.name}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(menu.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(menu.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? menu[sort.field as keyof typeof menu.$inferSelect] : menu.createdAt;
    
    const data = await db.select().from(menu)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(menu).where(whereClause);
    return { data: data as MenuSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const menuGetByPk = defineAction({
  meta: { name: 'system.menu.getByPk', displayName: '根据ID查询菜单', description: '根据主键ID查询单个菜单', tags: ['system', 'menu'], method: 'GET', path: '/api/system/menu/:id' },
  schemas: { paramsSchema: z.object({ id: z.string() }), outputSchema: menuZodSchemas.select.nullable() },
  execute: async (input, context) => {
    const { db } = context; const [result] = await db.select().from(menu).where(eq(menu.id, input.id)).limit(1); return (result as MenuSelect) ?? null; },
});

export const menuCreate = defineAction({
  meta: { name: 'system.menu.create', displayName: '创建菜单', description: '创建单个菜单', tags: ['system', 'menu'], method: 'POST', path: '/api/system/menu' },
  schemas: { bodySchema: z.object({ data: menuZodSchemas.insert }), outputSchema: menuZodSchemas.select },
  execute: async (input, context) => {
    const { db } = context; const [result] = await db.insert(menu).values(input.data as MenuInsert).returning(); return result as MenuSelect; },
});

export const menuCreateMany = defineAction({
  meta: { name: 'system.menu.createMany', displayName: '批量创建菜单', description: '批量创建多个菜单', tags: ['system', 'menu'], method: 'POST', path: '/api/system/menu/batch' },
  schemas: { bodySchema: z.object({ data: z.array(menuZodSchemas.insert) }), outputSchema: z.array(menuZodSchemas.select) },
  execute: async (input, context) => {
    const { db } = context; const results = await db.insert(menu).values(input.data as MenuInsert[]).returning(); return results as MenuSelect[]; },
});


export const menuUpdate = defineAction({
  meta: { name: 'system.menu.update', displayName: '更新菜单', description: '根据ID更新单个菜单', tags: ['system', 'menu'], method: 'PUT', path: '/api/system/menu/:id' },
  schemas: { paramsSchema: z.object({ id: z.string() }), bodySchema: z.object({ data: menuZodSchemas.update }), outputSchema: menuZodSchemas.select },
  execute: async (input, context) => {
    const { db } = context; const [result] = await db.update(menu).set(input.data as Partial<MenuInsert>).where(eq(menu.id, input.id)).returning(); return result as MenuSelect; },
});

export const menuUpdateMany = defineAction({
  meta: { name: 'system.menu.updateMany', displayName: '批量更新菜单', description: '根据ID列表批量更新菜单', tags: ['system', 'menu'], method: 'PUT', path: '/api/system/menu/batch' },
  schemas: { bodySchema: z.object({ ids: z.array(z.string()), data: menuZodSchemas.update }), outputSchema: z.array(menuZodSchemas.select) },
  execute: async (input, context) => {
    const { db } = context; const results: MenuSelect[] = []; for (const id of input.ids) { const [result] = await db.update(menu).set(input.data as Partial<MenuInsert>).where(eq(menu.id, id)).returning(); if (result) results.push(result as MenuSelect); } return results; },
});

export const menuDeleteByPk = defineAction({
  meta: { name: 'system.menu.deleteByPk', displayName: '删除菜单', description: '根据ID删除菜单', tags: ['system', 'menu'], method: 'DELETE', path: '/api/system/menu/:id' },
  schemas: { paramsSchema: z.object({ id: z.string() }), outputSchema: z.boolean() },
  execute: async (input, context) => {
    const { db } = context; const [result] = await db.delete(menu).where(eq(menu.id, input.id)).returning(); return !!result; },
});


export const menuGetSchema = defineAction({
  meta: { name: 'system.menu.getSchema', ignoreTools: true, displayName: '获取菜单Schema', description: '获取菜单表的JSON Schema', tags: ['system', 'menu'], method: 'GET', path: '/api/system/menu/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(menuZodSchemas.select) as Record<string, unknown>;
  },
});

export const menuActions = [menuGetByPagination, menuGetByPk, menuCreate, menuCreateMany, menuUpdate, menuUpdateMany, menuDeleteByPk, menuGetSchema];