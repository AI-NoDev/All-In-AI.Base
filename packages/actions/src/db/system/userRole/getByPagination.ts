/**
 * 分页查询用户角色关联
 */

import { t } from 'elysia';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userRole, userRoleSchemas } from '@qiyu-allinai/db/entities/system';
import { userRolePaginationBodySchema } from './schemas';
import type { UserRoleSelect } from '@qiyu-allinai/db/entities/system/userRole';

export const userRoleGetByPagination = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userRole.getByPagination',
    displayName: '分页查询用户角色关联',
    description: '分页查询用户与角色的关联关系。',
    tags: ['system', 'userRole'],
    method: 'POST',
    path: '/api/system/user-role/query',
  },
  schemas: {
    bodySchema: userRolePaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(userRoleSchemas.select), total: t.Number() }),
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
