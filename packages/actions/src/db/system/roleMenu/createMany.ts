/**
 * 批量创建角色菜单关联
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { roleMenu, roleMenuSchemas } from '@qiyu-allinai/db/entities/system';
import type { RoleMenuSelect, RoleMenuInsert } from '@qiyu-allinai/db/entities/system/roleMenu';

export const roleMenuCreateMany = defineAction({
  meta: {
    name: 'system.roleMenu.createMany',
    ignoreTools: true,
    displayName: '批量创建角色菜单关联',
    description: `批量创建多个角色与菜单的关联关系。

**请求体参数 (data)：**
- 数组，每个元素包含：
  - roleId: 角色UUID，必填
  - menuId: 菜单UUID，必填

**使用场景：**
- 为角色一次性分配多个菜单权限
- 批量导入角色菜单关联

**示例：**
\`\`\`json
{
  "data": [
    { "roleId": "role-1", "menuId": "menu-1" },
    { "roleId": "role-1", "menuId": "menu-2" },
    { "roleId": "role-1", "menuId": "menu-3" }
  ]
}
\`\`\``,
    tags: ['system', 'roleMenu'],
    method: 'POST',
    path: '/api/system/role-menu/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(roleMenuSchemas.insert) }),
    outputSchema: t.Array(roleMenuSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(roleMenu).values(input.data as RoleMenuInsert[]).returning();
    return results as RoleMenuSelect[];
  },
});
