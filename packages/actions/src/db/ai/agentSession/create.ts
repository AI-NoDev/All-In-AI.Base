/**
 * 创建Agent会话
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { agentSession } from '@qiyu-allinai/db/entities/ai';
import { agentSessionZodSchemas } from './schemas';
import type { AgentSessionSelect, AgentSessionInsert } from './utils';

export const agentSessionCreate = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.agentSession.create',
    displayName: '创建Agent会话',
    description: `创建单个Agent会话记录。

**必填字段：**
- agentId: 关联的Agent ID
- userId: 用户ID

**可选字段：**
- title: 会话标题（可后续根据首条消息自动生成）
- status: 状态
- isArchived: 是否归档，默认 false
- isPinned: 是否置顶，默认 false
- metadata: 元数据（JSON对象）

**自动初始化字段：**
- messageCount: 0
- tokenUsage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 }

**使用场景：**
1. 用户开始新对话时创建会话
2. 从Agent详情页发起对话

**示例：**
\`\`\`json
{
  "data": {
    "agentId": "agent-uuid",
    "userId": "user-uuid",
    "title": "新对话"
  }
}
\`\`\``,
    tags: ['ai', 'agentSession'],
    method: 'POST',
    path: '/api/ai/agent-session',
  },
  schemas: {
    bodySchema: z.object({ data: agentSessionZodSchemas.insert }),
    outputSchema: agentSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(agentSession).values(input.data as AgentSessionInsert).returning();
    return result as AgentSessionSelect;
  },
});
