/**
 * 根据复合主键查询角色菜单关联
 */

import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleMenu, roleMenuSchemas } from '@qiyu-allinai/db/entities/system';
import type { RoleMenuSelect } from '@qiyu-allinai/db/entities/system/roleMenu';

export const roleMenuGetByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.roleMenu.getByPk',
    displayName: '根据复合主键查询角色菜单关联',
    description: `根据角色ID和菜单ID的复合主键查询关联记录。

**路径参数：**
- roleId: 角色UUID，必填
- menuId: 菜单UUID，必填

**返回：**
- 成功：返回关联对象 { roleId, menuId }
- 未找到：返回 null

**示例：**
GET /api/system/role-menu/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002`,
    tags: ['system', 'roleMenu'],
    method: 'GET',
    path: '/api/system/role-menu/:roleId/:menuId',
  },
  schemas: {
    paramsSchema: t.Object({ roleId: t.String(), menuId: t.String() }),
    outputSchema: t.Union([roleMenuSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(roleMenu)
      .where(and(eq(roleMenu.roleId, input.roleId), eq(roleMenu.menuId, input.menuId)))
      .limit(1);
    return (result as RoleMenuSelect) ?? null;
  },
});
