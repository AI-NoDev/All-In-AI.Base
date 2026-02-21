/**
 * 获取API密钥Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { apiKeyZodSchemas } from './schemas';

export const apiKeyGetSchema = defineAction({
  meta: {
    name: 'ai.apiKey.getSchema',
    ignoreTools: true,
    displayName: '获取API密钥Schema',
    description: `获取API密钥表的JSON Schema定义。

**返回：** JSON Schema 对象

**使用场景：**
- 前端动态生成表单
- API文档生成`,
    tags: ['ai', 'apiKey'],
    method: 'GET',
    path: '/api/ai/api-key/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(apiKeyZodSchemas.select) as Record<string, unknown>;
  },
});
