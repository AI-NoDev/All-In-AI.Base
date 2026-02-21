/**
 * 获取AI会话Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { aiSessionZodSchemas } from './schemas';

export const aiSessionGetSchema = defineAction({
  meta: {
    name: 'ai.aiSession.getSchema',
    ignoreTools: true,
    displayName: '获取AI会话Schema',
    description: `获取AI会话表的JSON Schema定义。

**返回：** JSON Schema 对象

**使用场景：**
- 前端动态生成表单
- API文档生成`,
    tags: ['ai', 'aiSession'],
    method: 'GET',
    path: '/api/ai/session/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(aiSessionZodSchemas.select) as Record<string, unknown>;
  },
});
