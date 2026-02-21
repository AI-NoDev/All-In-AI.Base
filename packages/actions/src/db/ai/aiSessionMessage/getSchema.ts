/**
 * 获取AI会话消息Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { aiSessionMessageZodSchemas } from './schemas';

export const aiSessionMessageGetSchema = defineAction({
  meta: {
    name: 'ai.aiSessionMessage.getSchema',
    ignoreTools: true,
    displayName: '获取AI会话消息Schema',
    description: `获取AI会话消息表的JSON Schema定义。

**返回：** JSON Schema 对象

**使用场景：**
- 前端动态生成表单
- API文档生成`,
    tags: ['ai', 'aiSessionMessage'],
    method: 'GET',
    path: '/api/ai/session-message/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(aiSessionMessageZodSchemas.select) as Record<string, unknown>;
  },
});
