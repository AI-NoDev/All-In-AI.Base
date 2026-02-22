/**
 * 删除角色菜单关联
 */

import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleMenu } from '@qiyu-allinai/db/entities/system';

export const roleMenuDeleteByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.roleMenu.deleteByPk',
    displayName: '删除角色菜单关联',
    description: `根据复合主键删除角色与菜单的关联关系。

**路径参数：**
- roleId: 角色UUID，必填
- menuId: 菜单UUID，必填

**返回：**
- true: 删除成功
- false: 删除失败（关联不存在）

**示例：**
DELETE /api/system/role-menu/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002`,
    tags: ['system', 'roleMenu'],
    method: 'DELETE',
    path: '/api/system/role-menu/:roleId/:menuId',
  },
  schemas: {
    paramsSchema: z.object({ roleId: z.string(), menuId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(roleMenu)
      .where(and(eq(roleMenu.roleId, input.roleId), eq(roleMenu.menuId, input.menuId)))
      .returning();
    return !!result;
  },
});
