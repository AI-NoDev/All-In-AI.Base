/**
 * 获取用户角色关联Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { userRoleSchemas } from '@qiyu-allinai/db/entities/system/userRole';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(userRoleSchemas.select) as Record<string, unknown>;
  },
});
