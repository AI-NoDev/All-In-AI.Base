/**
 * 更新权限
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission, permissionSchemas } from '@qiyu-allinai/db/entities/system';
import type { PermissionSelect, PermissionInsert } from '@qiyu-allinai/db/entities/system/permission';

export const permissionUpdate = defineAction({
  meta: {
    name: 'system.permission.update',
    displayName: '更新权限',
    description: '根据ID更新权限信息',
    tags: ['system', 'permission'],
    method: 'PUT',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: permissionSchemas.update }),
    outputSchema: permissionSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(permission)
      .set(input.data as Partial<PermissionInsert>)
      .where(eq(permission.id, input.id))
      .returning();
    return result as PermissionSelect;
  },
});
