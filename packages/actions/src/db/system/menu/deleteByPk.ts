/**
 * 删除菜单
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { menu } from '@qiyu-allinai/db/entities/system';

export const menuDeleteByPk = defineAction({
  meta: {
    name: 'system.menu.deleteByPk',
    displayName: '删除菜单',
    description: `根据ID删除菜单（物理删除）。

**路径参数：**
- id: 菜单的UUID

**注意事项：**
- 删除后无法恢复
- 删除目录前应先删除其下的子菜单
- 删除菜单会影响已分配该菜单的角色

**返回：**
- true: 删除成功
- false: 未找到或删除失败

**示例：**
DELETE /api/system/menu/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'menu'],
    method: 'DELETE',
    path: '/api/system/menu/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(menu).where(eq(menu.id, input.id)).returning();
    return !!result;
  },
});
