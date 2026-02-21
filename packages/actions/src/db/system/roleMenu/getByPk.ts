/**
 * 根据复合主键查询角色菜单关联
 */

import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleMenu } from '@qiyu-allinai/db/entities/system';
import { roleMenuZodSchemas } from './schemas';
import type { RoleMenuSelect } from './utils';

export const roleMenuGetByPk = defineAction({
  meta: {
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
    paramsSchema: z.object({ roleId: z.string(), menuId: z.string() }),
    outputSchema: roleMenuZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(roleMenu)
      .where(and(eq(roleMenu.roleId, input.roleId), eq(roleMenu.menuId, input.menuId)))
      .limit(1);
    return (result as RoleMenuSelect) ?? null;
  },
});
