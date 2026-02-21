/**
 * 获取用户岗位关联Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { userPostZodSchemas } from './schemas';

export const userPostGetSchema = defineAction({
  meta: {
    name: 'system.userPost.getSchema',
    ignoreTools: true,
    displayName: '获取用户岗位关联Schema',
    description: `获取用户岗位关联表的JSON Schema定义。

**返回：**
- JSON Schema格式的表结构定义

**示例：**
GET /api/system/user-post/schema`,
    tags: ['system', 'userPost'],
    method: 'GET',
    path: '/api/system/user-post/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(userPostZodSchemas.select) as Record<string, unknown>;
  },
});
