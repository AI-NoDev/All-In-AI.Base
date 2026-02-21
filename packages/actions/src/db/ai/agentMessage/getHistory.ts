/**
 * 获取会话历史消息
 */

import { z } from 'zod';
import { eq, and, lte, desc } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentMessage } from '@qiyu-allinai/db/entities/ai';
import { agentMessageZodSchemas } from './schemas';
import type { AgentMessageSelect } from './utils';

export const agentMessageGetHistory = defineAction({
  meta: {
    name: 'ai.agentMessage.getHistory',
    displayName: '获取会话历史',
    description: `获取指定会话的消息历史，支持分页加载更早的消息。

**路径参数：**
- sessionId: 会话UUID

**查询参数：**
- limit: 返回消息数量，1-200，默认50
- beforeSeq: 获取此序号之前的消息（用于加载更早的历史）

**返回值：**
- 消息数组，按 msgSeq 升序排列

**使用场景：**
1. 进入会话时加载最近消息
2. 滚动加载更早的历史消息
3. 获取上下文用于AI对话

**示例：**
\`\`\`
GET /api/ai/agent-message/history/session-uuid?limit=50
GET /api/ai/agent-message/history/session-uuid?limit=50&beforeSeq=100
\`\`\``,
    tags: ['ai', 'agentMessage'],
    method: 'GET',
    path: '/api/ai/agent-message/history/:sessionId',
  },
  schemas: {
    paramsSchema: z.object({ sessionId: z.string() }),
    querySchema: z.object({
      limit: z.coerce.number().int().min(1).max(200).default(50),
      beforeSeq: z.coerce.number().int().optional(),
    }).optional(),
    outputSchema: z.array(agentMessageZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const conditions = [eq(agentMessage.sessionId, input.sessionId)];
    if (input.beforeSeq !== undefined) {
      conditions.push(lte(agentMessage.msgSeq, input.beforeSeq));
    }

    const data = await db.select().from(agentMessage)
      .where(and(...conditions))
      .orderBy(desc(agentMessage.msgSeq))
      .limit(input.limit ?? 50);

    // Return in ascending order
    return (data as AgentMessageSelect[]).reverse();
  },
});
