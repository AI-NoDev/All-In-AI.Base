/**
 * 获取角色菜单关联Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { roleMenuSchemas } from '@qiyu-allinai/db/entities/system/roleMenu';

export const roleMenuGetSchema = defineAction({
  meta: {
    name: 'system.roleMenu.getSchema',
    ignoreTools: true,
    displayName: '获取角色菜单关联Schema',
    description: `获取角色菜单关联表的JSON Schema定义。

**返回：**
- JSON Schema格式的表结构定义

**示例：**
GET /api/system/role-menu/schema`,
    tags: ['system', 'roleMenu'],
    method: 'GET',
    path: '/api/system/role-menu/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(roleMenuSchemas.select) as Record<string, unknown>;
  },
});
