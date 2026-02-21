/**
 * 获取Agent消息Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { agentMessageZodSchemas } from './schemas';

export const agentMessageGetSchema = defineAction({
  meta: {
    name: 'ai.agentMessage.getSchema',
    ignoreTools: true,
    displayName: '获取Agent消息Schema',
    description: `获取Agent消息表的JSON Schema定义。

**返回内容：**
- 字段名称和类型
- 必填/可选标识
- 字段约束

**使用场景：**
1. 前端动态生成消息编辑表单
2. 数据导入时的格式验证
3. API文档生成`,
    tags: ['ai', 'agentMessage'],
    method: 'GET',
    path: '/api/ai/agent-message/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(agentMessageZodSchemas.select) as Record<string, unknown>;
  },
});
