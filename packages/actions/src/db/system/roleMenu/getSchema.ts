/**
 * 获取角色菜单关联Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { roleMenuZodSchemas } from './schemas';

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
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(roleMenuZodSchemas.select) as Record<string, unknown>;
  },
});
