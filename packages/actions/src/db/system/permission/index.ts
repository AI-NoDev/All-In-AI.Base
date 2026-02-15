import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { permission, permissionZodSchemas } from '@qiyu-allinai/db/entities/system';

type PermissionSelect = typeof permission.$inferSelect;
type PermissionInsert = typeof permission.$inferInsert;

// ============ Filter Schema ============
const permissionFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  codes: z.array(z.string()).optional(),
  types: z.array(z.string()).optional(),
  modules: z.array(z.string()).optional(),
  parentId: z.string().nullable().optional(),
  status: z.boolean().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['code', 'name', 'orderNum', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: permissionFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(1000).default(100),
});

export const permissionGetByPagination = defineAction({
  meta: {
    name: 'system.permission.getByPagination',
    displayName: '分页查询权限',
    description: '分页查询权限列表',
    tags: ['system', 'permission'],
    method: 'POST',
    path: '/api/system/permission/query',
  },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(permissionZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;

    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(permission.id, filter.ids));
      if (filter.codes?.length) conditions.push(inArray(permission.code, filter.codes));
      if (filter.types?.length) conditions.push(inArray(permission.type, filter.types));
      if (filter.modules?.length) conditions.push(inArray(permission.module, filter.modules));
      if (filter.parentId !== undefined) {
        if (filter.parentId === null) {
          conditions.push(isNull(permission.parentId));
        } else {
          conditions.push(eq(permission.parentId, filter.parentId));
        }
      }
      if (filter.status !== undefined) conditions.push(eq(permission.status, filter.status));
      if (filter.code) conditions.push(ilike(permission.code, `%${filter.code}%`));
      if (filter.name) conditions.push(ilike(permission.name, `%${filter.name}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field
      ? permission[sort.field as keyof typeof permission.$inferSelect]
      : permission.orderNum;

    const data = await db
      .select()
      .from(permission)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof asc>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(permission)
      .where(whereClause);

    return { data: data as PermissionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const permissionGetByPk = defineAction({
  meta: {
    name: 'system.permission.getByPk',
    displayName: '根据ID查询权限',
    description: '根据主键ID查询单个权限',
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: permissionZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db
      .select()
      .from(permission)
      .where(eq(permission.id, input.id))
      .limit(1);
    return (result as PermissionSelect) ?? null;
  },
});

export const permissionCreate = defineAction({
  meta: {
    name: 'system.permission.create',
    displayName: '创建权限',
    description: '创建单个权限',
    tags: ['system', 'permission'],
    method: 'POST',
    path: '/api/system/permission',
  },
  schemas: {
    bodySchema: z.object({ data: permissionZodSchemas.insert }),
    outputSchema: permissionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(permission).values(input.data as PermissionInsert).returning();
    return result as PermissionSelect;
  },
});

export const permissionUpdate = defineAction({
  meta: {
    name: 'system.permission.update',
    displayName: '更新权限',
    description: '根据ID更新单个权限',
    tags: ['system', 'permission'],
    method: 'PUT',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: permissionZodSchemas.update }),
    outputSchema: permissionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db
      .update(permission)
      .set(input.data as Partial<PermissionInsert>)
      .where(eq(permission.id, input.id))
      .returning();
    return result as PermissionSelect;
  },
});

export const permissionDeleteByPk = defineAction({
  meta: {
    name: 'system.permission.deleteByPk',
    displayName: '删除权限',
    description: '根据ID删除权限（同时删除子权限）',
    tags: ['system', 'permission'],
    method: 'DELETE',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 递归删除子权限
    const deleteRecursive = async (parentId: string) => {
      const children = await db
        .select({ id: permission.id })
        .from(permission)
        .where(eq(permission.parentId, parentId));

      for (const child of children) {
        await deleteRecursive(child.id);
      }

      await db.delete(permission).where(eq(permission.id, parentId));
    };

    await deleteRecursive(input.id);
    return true;
  },
});

export const permissionGetTree = defineAction({
  meta: {
    name: 'system.permission.getTree',
    displayName: '获取权限树',
    description: '获取完整的权限树结构',
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/tree',
  },
  schemas: {
    outputSchema: z.array(permissionZodSchemas.select),
  },
  execute: async (_input, context) => {
    const { db } = context;
    const data = await db
      .select()
      .from(permission)
      .orderBy(asc(permission.orderNum));
    return data as PermissionSelect[];
  },
});

export const permissionGetSchema = defineAction({
  meta: {
    name: 'system.permission.getSchema',
    ignoreTools: true,
    displayName: '获取权限Schema',
    description: '获取权限表的JSON Schema',
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(permissionZodSchemas.select) as Record<string, unknown>;
  },
});

export const permissionActions = [
  permissionGetByPagination,
  permissionGetByPk,
  permissionCreate,
  permissionUpdate,
  permissionDeleteByPk,
  permissionGetTree,
  permissionGetSchema,
];
