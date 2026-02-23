/**
 * 获取权限树
 */

import { t } from 'elysia';
import { asc } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission, permissionSchemas } from '@qiyu-allinai/db/entities/system';
import type { PermissionSelect } from '@qiyu-allinai/db/entities/system/permission';

export const permissionGetTree = defineAction({
  meta: {
    name: 'system.permission.getTree',
    displayName: '获取权限树',
    description: '获取完整的权限树结构，按排序号升序排列',
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/tree',
  },
  schemas: {
    outputSchema: t.Array(permissionSchemas.select),
  },
  execute: async (_input, context) => {
    const { db } = context;
    const data = await db.select().from(permission).orderBy(asc(permission.orderNum));
    return data as PermissionSelect[];
  },
});
