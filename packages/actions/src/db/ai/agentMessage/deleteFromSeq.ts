/**
 * 删除指定序号及之后的消息
 */

import { z } from 'zod';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentMessage, agentSession } from '@qiyu-allinai/db/entities/ai';

export const agentMessageDeleteFromSeq = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.agentMessage.deleteFromSeq',
    displayName: '删除指定序号及之后的消息',
    description: `删除会话中指定 msgSeq 及之后的所有消息，用于"重新生成"功能。

**路径参数：**
- sessionId: 会话UUID
- msgSeq: 起始消息序号（包含）

**删除行为：**
- 删除 msgSeq >= 指定值的所有消息
- 更新会话的 messageCount 和 lastMessageAt

**返回值：**
- deletedCount: 删除的消息数量

**使用场景：**
1. 用户点击"重新生成"，删除AI回复及之后的消息
2. 回退到某个历史节点重新对话
3. 清理错误的对话内容

**示例：**
DELETE /api/ai/agent-message/from-seq/session-uuid/10
（删除 msgSeq >= 10 的所有消息）`,
    tags: ['ai', 'agentMessage'],
    method: 'DELETE',
    path: '/api/ai/agent-message/from-seq/:sessionId/:msgSeq',
  },
  schemas: {
    paramsSchema: z.object({
      sessionId: z.string(),
      msgSeq: z.coerce.number().int(),
    }),
    outputSchema: z.object({ deletedCount: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { sessionId, msgSeq } = input;

    // 统计要删除的消息数量
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(agentMessage)
      .where(and(
        eq(agentMessage.sessionId, sessionId),
        gte(agentMessage.msgSeq, msgSeq),
      ));
    const deletedCount = Number(countResult[0]?.count ?? 0);

    if (deletedCount === 0) {
      return { deletedCount: 0 };
    }

    // 删除消息
    await db.delete(agentMessage).where(and(
      eq(agentMessage.sessionId, sessionId),
      gte(agentMessage.msgSeq, msgSeq),
    ));

    // 获取剩余消息的最后一条
    const [lastMsg] = await db.select()
      .from(agentMessage)
      .where(eq(agentMessage.sessionId, sessionId))
      .orderBy(desc(agentMessage.msgSeq))
      .limit(1);

    // 更新会话统计
    await db.update(agentSession).set({
      messageCount: sql`GREATEST(message_count - ${deletedCount}, 0)`,
      lastMessageAt: lastMsg?.createdAt || null,
      updatedAt: new Date().toISOString(),
    }).where(eq(agentSession.id, sessionId));

    return { deletedCount };
  },
});
