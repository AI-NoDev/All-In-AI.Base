/**
 * 获取角色的菜单ID列表
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleMenu } from '@qiyu-allinai/db/entities/system';

export const roleMenuGetByRoleId = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.roleMenu.getByRoleId',
    displayName: '获取角色菜单',
    description: `获取指定角色的所有菜单ID列表。

**路径参数：**
- roleId: 角色UUID，必填

**返回：**
- 菜单ID数组，如 ["menu-id-1", "menu-id-2", "menu-id-3"]

**使用场景：**
- 角色菜单权限配置页面，获取当前角色已分配的菜单
- 用户登录后获取可访问的菜单列表

**示例：**
GET /api/system/role-menu/role/550e8400-e29b-41d4-a716-446655440000

**返回示例：**
\`\`\`json
["menu-id-1", "menu-id-2", "menu-id-3"]
\`\`\``,
    tags: ['system', 'roleMenu'],
    method: 'GET',
    path: '/api/system/role-menu/role/:roleId',
  },
  schemas: {
    paramsSchema: t.Object({ roleId: t.String() }),
    outputSchema: t.Array(t.String()),
  },
  execute: async (input, context) => {
    const { db } = context;
    const data = await db.select({ menuId: roleMenu.menuId }).from(roleMenu).where(eq(roleMenu.roleId, input.roleId));
    return data.map(d => d.menuId);
  },
});
