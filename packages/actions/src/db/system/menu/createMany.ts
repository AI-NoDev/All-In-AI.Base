/**
 * 批量创建菜单
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { menu } from '@qiyu-allinai/db/entities/system';
import { menuZodSchemas } from './schemas';
import type { MenuSelect, MenuInsert } from './utils';

export const menuCreateMany = defineAction({
  meta: {
    name: 'system.menu.createMany',
    displayName: '批量创建菜单',
    description: `批量创建多个菜单项，适用于初始化场景。

**请求体：**
- data: 菜单对象数组

**示例：**
\`\`\`json
{
  "data": [
    { "name": "系统管理", "type": "M", "orderNum": 1 },
    { "name": "用户管理", "type": "C", "parentId": "xxx", "path": "/system/users" }
  ]
}
\`\`\`

**返回：** 创建成功的菜单对象数组`,
    tags: ['system', 'menu'],
    method: 'POST',
    path: '/api/system/menu/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(menuZodSchemas.insert) }),
    outputSchema: z.array(menuZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(menu).values(input.data as MenuInsert[]).returning();
    return results as MenuSelect[];
  },
});
