/**
 * 创建用户角色关联
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { userRole, userRoleSchemas } from '@qiyu-allinai/db/entities/system';
import type { UserRoleSelect, UserRoleInsert } from '@qiyu-allinai/db/entities/system/userRole';

export const userRoleCreate = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userRole.create',
    displayName: '创建用户角色关联',
    description: '创建单个用户与角色的关联关系。',
    tags: ['system', 'userRole'],
    method: 'POST',
    path: '/api/system/user-role',
  },
  schemas: {
    bodySchema: t.Object({ data: userRoleSchemas.insert }),
    outputSchema: userRoleSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(userRole).values(input.data as UserRoleInsert).returning();
    return result as UserRoleSelect;
  },
});
