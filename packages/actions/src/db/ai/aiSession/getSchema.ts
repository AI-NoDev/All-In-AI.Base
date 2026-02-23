/**
 * 获取AI会话Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { aiSessionSchemas } from './schemas';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(aiSessionSchemas.select) as Record<string, unknown>;
  },
});
