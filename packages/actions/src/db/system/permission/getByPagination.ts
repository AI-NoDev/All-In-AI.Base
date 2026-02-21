/**
 * 分页查询权限
 */

import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission } from '@qiyu-allinai/db/entities/system';
import { permissionPaginationBodySchema, permissionZodSchemas } from './schemas';
import type { PermissionSelect } from './utils';

export const permissionGetByPagination = defineAction({
  meta: {
    name: 'system.permission.getByPagination',
    displayName: '分页查询权限',
    description: `分页查询权限列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询，如 ["id1", "id2"]
- codes: 按权限编码列表查询，如 ["system:user:view", "system:user:edit"]
- types: 按类型列表查询，如 ["menu", "button", "api"]
- modules: 按模块列表查询，如 ["system", "ai", "im"]
- parentId: 按父级ID查询，null表示查询顶级权限
- status: 按状态过滤，true=启用，false=禁用
- code: 按权限编码模糊搜索
- name: 按权限名称模糊搜索

**排序参数 (sort)：**
- field: code | name | orderNum | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-1000，默认100

**示例：**
\`\`\`json
{
  "filter": { "modules": ["system"], "status": true },
  "sort": { "field": "orderNum", "order": "asc" },
  "offset": 0,
  "limit": 100
}
\`\`\``,
    tags: ['system', 'permission'],
    method: 'POST',
    path: '/api/system/permission/query',
  },
  schemas: {
    bodySchema: permissionPaginationBodySchema,
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
      ? permission[sort.field as keyof PermissionSelect]
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
