/**
 * 删除用户角色关联
 */

import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userRole } from '@qiyu-allinai/db/entities/system';

export const userRoleDeleteByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userRole.deleteByPk',
    displayName: '删除用户角色关联',
    description: '根据复合主键删除用户与角色的关联关系。',
    tags: ['system', 'userRole'],
    method: 'DELETE',
    path: '/api/system/user-role/:userId/:roleId',
  },
  schemas: {
    paramsSchema: t.Object({ userId: t.String(), roleId: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(userRole)
      .where(and(eq(userRole.userId, input.userId), eq(userRole.roleId, input.roleId)))
      .returning();
    return !!result;
  },
});
