/**
 * 创建权限
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { permission, permissionSchemas } from '@qiyu-allinai/db/entities/system';
import type { PermissionSelect, PermissionInsert } from '@qiyu-allinai/db/entities/system/permission';

export const permissionCreate = defineAction({
  meta: {
    name: 'system.permission.create',
    displayName: '创建权限',
    description: '创建单个权限记录',
    tags: ['system', 'permission'],
    method: 'POST',
    path: '/api/system/permission',
  },
  schemas: {
    bodySchema: t.Object({ data: permissionSchemas.insert }),
    outputSchema: permissionSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(permission).values(input.data as PermissionInsert).returning();
    return result as PermissionSelect;
  },
});
