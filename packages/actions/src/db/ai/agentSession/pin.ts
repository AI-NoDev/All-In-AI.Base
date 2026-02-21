/**
 * 置顶Agent会话
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentSession } from '@qiyu-allinai/db/entities/ai';
import { agentSessionZodSchemas } from './schemas';
import type { AgentSessionSelect } from './utils';

export const agentSessionPin = defineAction({
  meta: {
    name: 'ai.agentSession.pin',
    displayName: '置顶Agent会话',
    description: `置顶或取消置顶Agent会话。

**路径参数：**
- id: 会话UUID

**请求体：**
- isPinned: true=置顶，false=取消置顶

**置顶行为：**
- 置顶会话在列表中优先显示
- 可通过 filter.isPinned = true 只查看置顶会话

**使用场景：**
1. 将重要会话置顶方便快速访问
2. 取消不再重要的会话置顶

**示例：**
\`\`\`json
// PUT /api/ai/agent-session/xxx/pin
{ "isPinned": true }
\`\`\``,
    tags: ['ai', 'agentSession'],
    method: 'PUT',
    path: '/api/ai/agent-session/:id/pin',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ isPinned: z.boolean() }),
    outputSchema: agentSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agentSession)
      .set({
        isPinned: input.isPinned,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt)))
      .returning();
    return result as AgentSessionSelect;
  },
});
