/**
 * 根据ID查询权限
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission, permissionSchemas } from '@qiyu-allinai/db/entities/system';
import type { PermissionSelect } from '@qiyu-allinai/db/entities/system/permission';

export const permissionGetByPk = defineAction({
  meta: {
    name: 'system.permission.getByPk',
    displayName: '根据ID查询权限',
    description: '根据权限ID查询单个权限详情',
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([permissionSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(permission).where(eq(permission.id, input.id)).limit(1);
    return (result as PermissionSelect) ?? null;
  },
});
