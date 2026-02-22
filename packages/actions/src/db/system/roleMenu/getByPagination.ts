/**
 * 分页查询角色菜单关联
 */

import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleMenu } from '@qiyu-allinai/db/entities/system';
import { roleMenuPaginationBodySchema, roleMenuZodSchemas } from './schemas';
import type { RoleMenuSelect } from './utils';

export const roleMenuGetByPagination = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.roleMenu.getByPagination',
    displayName: '分页查询角色菜单关联',
    description: `分页查询角色与菜单的关联关系，用于菜单权限控制。

**过滤参数 (filter)：**
- roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"]
- menuIds: 按菜单ID列表查询，如 ["menu-id-1", "menu-id-2"]
- roleId: 按单个角色ID精确查询
- menuId: 按单个菜单ID精确查询

**排序参数 (sort)：**
- field: roleId | menuId
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
- 查询某角色关联的所有菜单
- 查询某菜单关联的所有角色
- 菜单权限配置

**示例：**
\`\`\`json
{
  "filter": { "roleId": "550e8400-e29b-41d4-a716-446655440000" },
  "sort": { "field": "menuId", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['system', 'roleMenu'],
    method: 'POST',
    path: '/api/system/role-menu/query',
  },
  schemas: {
    bodySchema: roleMenuPaginationBodySchema,
    outputSchema: z.object({ data: z.array(roleMenuZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.roleIds?.length) conditions.push(inArray(roleMenu.roleId, filter.roleIds));
      if (filter.menuIds?.length) conditions.push(inArray(roleMenu.menuId, filter.menuIds));
      if (filter.roleId) conditions.push(eq(roleMenu.roleId, filter.roleId));
      if (filter.menuId) conditions.push(eq(roleMenu.menuId, filter.menuId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? roleMenu[sort.field as keyof RoleMenuSelect] : roleMenu.roleId;

    const data = await db.select().from(roleMenu)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(roleMenu).where(whereClause);
    return { data: data as RoleMenuSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
