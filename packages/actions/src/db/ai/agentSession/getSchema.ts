/**
 * 获取Agent会话Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { agentSessionSchemas } from './schemas';

export const agentSessionGetSchema = defineAction({
  meta: {
    name: 'ai.agentSession.getSchema',
    ignoreTools: true,
    displayName: '获取Agent会话Schema',
    description: `获取Agent会话表的JSON Schema定义。

**返回内容：**
- 字段名称和类型
- 必填/可选标识
- 字段约束

**使用场景：**
1. 前端动态生成会话编辑表单
2. 数据导入时的格式验证
3. API文档生成`,
    tags: ['ai', 'agentSession'],
    method: 'GET',
    path: '/api/ai/agent-session/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(agentSessionSchemas.select) as Record<string, unknown>;
  },
});
