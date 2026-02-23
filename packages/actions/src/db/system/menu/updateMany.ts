/**
 * 批量更新菜单
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { menu, menuSchemas } from '@qiyu-allinai/db/entities/system';
import type { MenuSelect, MenuInsert } from '@qiyu-allinai/db/entities/system/menu';

export const menuUpdateMany = defineAction({
  meta: {
    name: 'system.menu.updateMany',
    ignoreTools: true,
    displayName: '批量更新菜单',
    description: `根据ID列表批量更新多个菜单。

**请求体：**
- ids: 要更新的菜单ID数组
- data: 更新数据对象

**使用场景：**
- 批量显示/隐藏菜单
- 批量启用/禁用菜单

**示例：**
\`\`\`json
{
  "ids": ["menu-id-1", "menu-id-2"],
  "data": { "visible": false }
}
\`\`\`

**返回：** 更新成功的菜单对象数组`,
    tags: ['system', 'menu'],
    method: 'PUT',
    path: '/api/system/menu/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: menuSchemas.update }),
    outputSchema: t.Array(menuSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: MenuSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(menu)
        .set(input.data as Partial<MenuInsert>)
        .where(eq(menu.id, id))
        .returning();
      if (result) results.push(result as MenuSelect);
    }
    return results;
  },
});
