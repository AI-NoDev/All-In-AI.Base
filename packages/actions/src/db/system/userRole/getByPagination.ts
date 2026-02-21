/**
 * 分页查询用户角色关联
 */

import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userRole } from '@qiyu-allinai/db/entities/system';
import { userRolePaginationBodySchema, userRoleZodSchemas } from './schemas';
import type { UserRoleSelect } from './utils';

export const userRoleGetByPagination = defineAction({
  meta: {
    name: 'system.userRole.getByPagination',
    displayName: '分页查询用户角色关联',
    description: `分页查询用户与角色的关联关系，用于权限控制。

**过滤参数 (filter)：**
- userIds: 按用户ID列表查询，如 ["user-id-1", "user-id-2"]
- roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"]
- userId: 按单个用户ID精确查询
- roleId: 按单个角色ID精确查询

**排序参数 (sort)：**
- field: userId | roleId
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
- 查询某用户关联的所有角色
- 查询某角色关联的所有用户
- 用户角色配置管理

**示例：**
\`\`\`json
{
  "filter": { "userId": "550e8400-e29b-41d4-a716-446655440000" },
  "sort": { "field": "roleId", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['system', 'userRole'],
    method: 'POST',
    path: '/api/system/user-role/query',
  },
  schemas: {
    bodySchema: userRolePaginationBodySchema,
    outputSchema: z.object({ data: z.array(userRoleZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.userIds?.length) conditions.push(inArray(userRole.userId, filter.userIds));
      if (filter.roleIds?.length) conditions.push(inArray(userRole.roleId, filter.roleIds));
      if (filter.userId) conditions.push(eq(userRole.userId, filter.userId));
      if (filter.roleId) conditions.push(eq(userRole.roleId, filter.roleId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? userRole[sort.field as keyof UserRoleSelect] : userRole.userId;

    const data = await db.select().from(userRole)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(userRole).where(whereClause);
    return { data: data as UserRoleSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
