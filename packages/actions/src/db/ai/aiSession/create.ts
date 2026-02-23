/**
 * 创建AI会话
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { aiSession } from '@qiyu-allinai/db/entities/ai';
import { aiSessionSchemas, type AISessionSelect, type AISessionInsert } from './schemas';

export const aiSessionCreate = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.aiSession.create',
    displayName: '创建AI会话',
    description: `创建单个AI会话。

**必填字段：**
- userId: 所属用户ID

**可选字段：**
- title: 会话标题（可后续根据首条消息自动生成）
- modelId: 使用的模型ID
- agentId: 使用的智能体ID
- systemPrompt: 系统提示词
- isPinned: 是否置顶，默认false
- isArchived: 是否归档，默认false
- status: 状态

**示例：**
\`\`\`json
{
  "data": {
    "userId": "user-uuid",
    "title": "新对话",
    "modelId": "model-uuid"
  }
}
\`\`\``,
    tags: ['ai', 'aiSession'],
    method: 'POST',
    path: '/api/ai/session',
  },
  schemas: {
    bodySchema: t.Object({ data: aiSessionSchemas.insert }),
    outputSchema: aiSessionSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(aiSession).values(input.data as AISessionInsert).returning();
    return result as AISessionSelect;
  },
});
