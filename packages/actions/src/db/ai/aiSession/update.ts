/**
 * 更新AI会话
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSession } from '@qiyu-allinai/db/entities/ai';
import { aiSessionZodSchemas } from './schemas';
import type { AISessionSelect } from './utils';

export const aiSessionUpdate = defineAction({
  meta: {
    name: 'ai.aiSession.update',
    displayName: '更新AI会话',
    description: `更新单个AI会话的信息。

**路径参数：**
- id: 会话的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- title: 会话标题
- modelId: 使用的模型ID
- agentId: 使用的智能体ID
- systemPrompt: 系统提示词
- isPinned: 是否置顶
- isArchived: 是否归档
- status: 状态

**常用场景：**
1. 重命名会话
2. 置顶/取消置顶
3. 归档会话
4. 切换模型

**示例：**
\`\`\`json
PUT /api/ai/session/xxx-uuid
{
  "data": { "title": "关于React的讨论", "isPinned": true }
}
\`\`\``,
    tags: ['ai', 'aiSession'],
    method: 'PUT',
    path: '/api/ai/session/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: aiSessionZodSchemas.update }),
    outputSchema: aiSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(aiSession)
      .set({ ...input.data, updatedAt: new Date().toISOString() })
      .where(eq(aiSession.id, input.id))
      .returning();
    return result as AISessionSelect;
  },
});
