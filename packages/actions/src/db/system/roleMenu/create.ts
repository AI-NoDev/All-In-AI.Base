/**
 * 创建角色菜单关联
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { roleMenu } from '@qiyu-allinai/db/entities/system';
import { roleMenuZodSchemas } from './schemas';
import type { RoleMenuSelect, RoleMenuInsert } from './utils';

export const roleMenuCreate = defineAction({
  meta: {
    name: 'system.roleMenu.create',
    displayName: '创建角色菜单关联',
    description: `创建单个角色与菜单的关联关系。

**请求体参数 (data)：**
- roleId: 角色UUID，必填
- menuId: 菜单UUID，必填

**使用场景：**
- 为角色分配单个菜单权限
- 动态添加菜单访问权限

**示例：**
\`\`\`json
{
  "data": {
    "roleId": "550e8400-e29b-41d4-a716-446655440001",
    "menuId": "550e8400-e29b-41d4-a716-446655440002"
  }
}
\`\`\``,
    tags: ['system', 'roleMenu'],
    method: 'POST',
    path: '/api/system/role-menu',
  },
  schemas: {
    bodySchema: z.object({ data: roleMenuZodSchemas.insert }),
    outputSchema: roleMenuZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(roleMenu).values(input.data as RoleMenuInsert).returning();
    return result as RoleMenuSelect;
  },
});
