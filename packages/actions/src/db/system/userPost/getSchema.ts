/**
 * 获取用户岗位关联Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { userPostSchemas } from '@qiyu-allinai/db/entities/system/userPost';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(userPostSchemas.select) as Record<string, unknown>;
  },
});
