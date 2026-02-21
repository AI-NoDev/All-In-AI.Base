/**
 * 更新菜单
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { menu } from '@qiyu-allinai/db/entities/system';
import { menuZodSchemas } from './schemas';
import type { MenuSelect, MenuInsert } from './utils';

export const menuUpdate = defineAction({
  meta: {
    name: 'system.menu.update',
    displayName: '更新菜单',
    description: `根据ID更新单个菜单的信息。

**路径参数：**
- id: 菜单的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- name: 菜单名称
- type: 菜单类型
- parentId: 父级菜单ID
- path: 路由路径
- component: 组件路径
- permission: 权限标识
- icon: 图标
- orderNum: 排序号
- visible: 是否可见
- status: 状态

**示例：**
\`\`\`json
PUT /api/system/menu/xxx-uuid
{
  "data": { "visible": false, "orderNum": 10 }
}
\`\`\``,
    tags: ['system', 'menu'],
    method: 'PUT',
    path: '/api/system/menu/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: menuZodSchemas.update }),
    outputSchema: menuZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(menu)
      .set(input.data as Partial<MenuInsert>)
      .where(eq(menu.id, input.id))
      .returning();
    return result as MenuSelect;
  },
});
