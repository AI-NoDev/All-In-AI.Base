/**
 * 分页查询权限
 */

import { t } from 'elysia';
import { eq, and, isNull, sql, ilike, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission, permissionSchemas } from '@qiyu-allinai/db/entities/system';
import { permissionPaginationBodySchema } from './schemas';
import type { PermissionSelect } from '@qiyu-allinai/db/entities/system/permission';

export const permissionGetByPagination = defineAction({
  meta: {
    name: 'system.permission.getByPagination',
    displayName: '分页查询权限',
    description: '分页查询权限列表，支持多种过滤和排序方式',
    tags: ['system', 'permission'],
    method: 'POST',
    path: '/api/system/permission/query',
  },
  schemas: {
    bodySchema: permissionPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(permissionSchemas.select), total: t.Number() }),
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
    const sortColumn = sort?.field ? permission[sort.field as keyof PermissionSelect] : permission.orderNum;

    const data = await db.select().from(permission)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof asc>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(permission).where(whereClause);
    return { data: data as PermissionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
