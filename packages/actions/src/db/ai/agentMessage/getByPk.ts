/**
 * 根据ID查询Agent消息
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentMessage } from '@qiyu-allinai/db/entities/ai';
import { agentMessageZodSchemas } from './schemas';
import type { AgentMessageSelect } from './utils';

export const agentMessageGetByPk = defineAction({
  meta: {
    name: 'ai.agentMessage.getByPk',
    displayName: '根据ID查询Agent消息',
    description: `根据主键ID查询单个Agent消息详情。

**参数说明：**
- id: 消息的UUID主键

**返回值：**
- 成功：返回消息完整信息（id, sessionId, role, content, contentType, tokenUsage, finishReason等）
- 未找到：返回 null

**使用场景：**
1. 查看消息详情
2. 获取消息的Token使用情况
3. 验证消息是否存在

**示例：**
GET /api/ai/agent-message/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'agentMessage'],
    method: 'GET',
    path: '/api/ai/agent-message/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: agentMessageZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(agentMessage).where(eq(agentMessage.id, input.id)).limit(1);
    return (result as AgentMessageSelect) ?? null;
  },
});
