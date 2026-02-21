/**
 * 根据ID查询菜单
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { menu } from '@qiyu-allinai/db/entities/system';
import { menuZodSchemas } from './schemas';
import type { MenuSelect } from './utils';

export const menuGetByPk = defineAction({
  meta: {
    name: 'system.menu.getByPk',
    displayName: '根据ID查询菜单',
    description: `根据主键ID查询单个菜单的详细信息。

**路径参数：**
- id: 菜单的UUID

**返回：**
- 找到时返回完整的菜单对象
- 未找到时返回 null

**示例：**
GET /api/system/menu/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'menu'],
    method: 'GET',
    path: '/api/system/menu/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: menuZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(menu).where(eq(menu.id, input.id)).limit(1);
    return (result as MenuSelect) ?? null;
  },
});
