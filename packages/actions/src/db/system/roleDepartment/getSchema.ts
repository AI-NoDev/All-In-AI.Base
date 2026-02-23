/**
 * 获取角色部门关联Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { roleDepartmentSchemas } from '@qiyu-allinai/db/entities/system/roleDepartment';

export const roleDepartmentGetSchema = defineAction({
  meta: {
    name: 'system.roleDepartment.getSchema',
    ignoreTools: true,
    displayName: '获取角色部门关联Schema',
    description: `获取角色部门关联表的JSON Schema定义。

**返回：**
- JSON Schema格式的表结构定义

**示例：**
GET /api/system/role-department/schema`,
    tags: ['system', 'roleDepartment'],
    method: 'GET',
    path: '/api/system/role-department/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(roleDepartmentSchemas.select) as Record<string, unknown>;
  },
});
