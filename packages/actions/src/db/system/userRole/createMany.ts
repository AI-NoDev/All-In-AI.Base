/**
 * 批量创建用户角色关联
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { userRole, userRoleSchemas } from '@qiyu-allinai/db/entities/system';
import type { UserRoleSelect, UserRoleInsert } from '@qiyu-allinai/db/entities/system/userRole';

export const userRoleCreateMany = defineAction({
  meta: {
    name: 'system.userRole.createMany',
    ignoreTools: true,
    displayName: '批量创建用户角色关联',
    description: '批量创建多个用户与角色的关联关系。',
    tags: ['system', 'userRole'],
    method: 'POST',
    path: '/api/system/user-role/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(userRoleSchemas.insert) }),
    outputSchema: t.Array(userRoleSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(userRole).values(input.data as UserRoleInsert[]).returning();
    return results as UserRoleSelect[];
  },
});
