/**
 * 更新Agent会话
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentSession } from '@qiyu-allinai/db/entities/ai';
import { agentSessionZodSchemas } from './schemas';
import type { AgentSessionSelect, AgentSessionInsert } from './utils';

export const agentSessionUpdate = defineAction({
  meta: {
    name: 'ai.agentSession.update',
    displayName: '更新Agent会话',
    description: `根据ID更新单个Agent会话信息。

**路径参数：**
- id: 会话UUID

**可更新字段：**
- title: 会话标题
- status: 状态
- isArchived: 是否归档
- isPinned: 是否置顶
- metadata: 元数据

**使用场景：**
1. 修改会话标题
2. 更新会话状态
3. 修改元数据

**示例：**
\`\`\`json
// PUT /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000
{
  "data": {
    "title": "关于项目架构的讨论"
  }
}
\`\`\``,
    tags: ['ai', 'agentSession'],
    method: 'PUT',
    path: '/api/ai/agent-session/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: agentSessionZodSchemas.update }),
    outputSchema: agentSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agentSession)
      .set(input.data as Partial<AgentSessionInsert>)
      .where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt)))
      .returning();
    return result as AgentSessionSelect;
  },
});
