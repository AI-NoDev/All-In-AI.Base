/**
 * 删除权限
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission } from '@qiyu-allinai/db/entities/system';

export const permissionDeleteByPk = defineAction({
  meta: {
    name: 'system.permission.deleteByPk',
    displayName: '删除权限',
    description: `根据ID删除权限，会递归删除所有子权限。

**路径参数：**
- id: 权限UUID，必填

**注意事项：**
- 删除操作会递归删除该权限下的所有子权限
- 删除前请确认没有角色关联该权限
- 此操作不可恢复

**返回：**
- true: 删除成功
- false: 删除失败（权限不存在）

**示例：**
DELETE /api/system/permission/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'permission'],
    method: 'DELETE',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 递归删除子权限
    const deleteRecursive = async (parentId: string) => {
      const children = await db
        .select({ id: permission.id })
        .from(permission)
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
