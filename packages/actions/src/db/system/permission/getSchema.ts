/**
 * 获取权限Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { permissionZodSchemas } from './schemas';

export const permissionGetSchema = defineAction({
  meta: {
    name: 'system.permission.getSchema',
    ignoreTools: true,
    displayName: '获取权限Schema',
    description: `获取权限表的JSON Schema定义，用于动态表单生成和数据验证。

**返回：**
- JSON Schema格式的权限表结构定义

**示例：**
GET /api/system/permission/schema`,
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(permissionZodSchemas.select) as Record<string, unknown>;
  },
});
