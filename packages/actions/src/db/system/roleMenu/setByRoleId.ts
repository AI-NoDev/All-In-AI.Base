/**
 * 设置角色的菜单列表（全量替换）
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleMenu } from '@qiyu-allinai/db/entities/system';
import type { RoleMenuInsert } from './utils';

export const roleMenuSetByRoleId = defineAction({
  meta: {
    name: 'system.roleMenu.setByRoleId',
    displayName: '设置角色菜单',
    description: `设置指定角色的菜单列表，采用全量替换方式。

**路径参数：**
- roleId: 角色UUID，必填

**请求体参数：**
- menuIds: 菜单ID数组，必填，可为空数组（清空所有菜单权限）

**操作逻辑：**
1. 删除该角色的所有现有菜单关联
2. 插入新的菜单关联列表

**使用场景：**
- 角色菜单权限配置页面，保存角色的菜单权限
- 批量更新角色的菜单访问权限

**示例：**
PUT /api/system/role-menu/role/550e8400-e29b-41d4-a716-446655440000
\`\`\`json
{
  "menuIds": ["menu-id-1", "menu-id-2", "menu-id-3"]
}
\`\`\`

**清空菜单权限：**
\`\`\`json
{
  "menuIds": []
}
\`\`\``,
    tags: ['system', 'roleMenu'],
    method: 'PUT',
    path: '/api/system/role-menu/role/:roleId',
  },
  schemas: {
    paramsSchema: z.object({ roleId: z.string() }),
    bodySchema: z.object({ menuIds: z.array(z.string()) }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 删除该角色的所有菜单关联
    await db.delete(roleMenu).where(eq(roleMenu.roleId, input.roleId));

    // 插入新的菜单关联
    if (input.menuIds.length > 0) {
      const newRecords: RoleMenuInsert[] = input.menuIds.map(menuId => ({
        roleId: input.roleId,
        menuId,
      }));
      await db.insert(roleMenu).values(newRecords);
    }

    return true;
  },
});
