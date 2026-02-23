/**
 * 删除权限
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission } from '@qiyu-allinai/db/entities/system';

export const permissionDeleteByPk = defineAction({
  meta: {
    name: 'system.permission.deleteByPk',
    displayName: '删除权限',
    description: '根据ID删除权限，会递归删除所有子权限',
    tags: ['system', 'permission'],
    method: 'DELETE',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 递归删除子权限
    const deleteRecursive = async (parentId: string) => {
      const children = await db.select({ id: permission.id }).from(permission)
        .where(eq(permission.parentId, parentId));

      for (const child of children) {
        await deleteRecursive(child.id);
      }

      await db.delete(permission).where(eq(permission.id, parentId));
    };

    await deleteRecursive(input.id);
    return true;
  },
});
