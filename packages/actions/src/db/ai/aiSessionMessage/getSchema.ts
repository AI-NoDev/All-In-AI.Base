/**
 * 获取AI会话消息Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { aiSessionMessageSchemas } from './schemas';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(aiSessionMessageSchemas.select) as Record<string, unknown>;
  },
});
