/**
 * 根据复合主键查询用户角色关联
 */

import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userRole, userRoleSchemas } from '@qiyu-allinai/db/entities/system';
import type { UserRoleSelect } from '@qiyu-allinai/db/entities/system/userRole';

export const userRoleGetByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userRole.getByPk',
    displayName: '根据复合主键查询用户角色关联',
    description: '根据用户ID和角色ID的复合主键查询关联记录。',
    tags: ['system', 'userRole'],
    method: 'GET',
    path: '/api/system/user-role/:userId/:roleId',
  },
  schemas: {
    paramsSchema: t.Object({ userId: t.String(), roleId: t.String() }),
    outputSchema: t.Union([userRoleSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(userRole)
      .where(and(eq(userRole.userId, input.userId), eq(userRole.roleId, input.roleId)))
      .limit(1);
    return (result as UserRoleSelect) ?? null;
  },
});
