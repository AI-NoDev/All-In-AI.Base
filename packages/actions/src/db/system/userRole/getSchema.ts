/**
 * 获取用户角色关联Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { userRoleZodSchemas } from './schemas';

export const userRoleGetSchema = defineAction({
  meta: {
    name: 'system.userRole.getSchema',
    ignoreTools: true,
    displayName: '获取用户角色关联Schema',
    description: `获取用户角色关联表的JSON Schema定义。

**返回：**
- JSON Schema格式的表结构定义

**示例：**
GET /api/system/user-role/schema`,
    tags: ['system', 'userRole'],
    method: 'GET',
    path: '/api/system/user-role/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(userRoleZodSchemas.select) as Record<string, unknown>;
  },
});
