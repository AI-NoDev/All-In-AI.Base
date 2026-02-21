/**
 * 删除Agent消息
 */

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentMessage, agentSession } from '@qiyu-allinai/db/entities/ai';

export const agentMessageDeleteByPk = defineAction({
  meta: {
    name: 'ai.agentMessage.deleteByPk',
    displayName: '删除Agent消息',
    description: `根据ID删除单条Agent消息，并更新会话统计。

**参数说明：**
- id: 消息UUID

**删除行为：**
- 物理删除：数据从数据库中永久移除
- 自动更新会话的 messageCount

**返回值：**
- success: true=删除成功，false=消息不存在

**注意事项：**
- 删除消息不会重新排列其他消息的 msgSeq
- 如需删除某条消息及之后的所有消息，使用 deleteFromSeq

**示例：**
DELETE /api/ai/agent-message/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'agentMessage'],
    method: 'DELETE',
    path: '/api/ai/agent-message/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;

    // 先获取消息信息
    const [msg] = await db.select().from(agentMessage).where(eq(agentMessage.id, input.id)).limit(1);
    if (!msg) {
      return { success: false };
    }

    // 删除消息
    await db.delete(agentMessage).where(eq(agentMessage.id, input.id));

    // 更新会话统计
    await db.update(agentSession).set({
      messageCount: sql`GREATEST(message_count - 1, 0)`,
      updatedAt: new Date().toISOString(),
    }).where(eq(agentSession.id, msg.sessionId));

    return { success: true };
  },
});
