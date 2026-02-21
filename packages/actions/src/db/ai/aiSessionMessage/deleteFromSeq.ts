/**
 * 删除指定序号及之后的消息
 */

import { z } from 'zod';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSessionMessage, aiSession } from '@qiyu-allinai/db/entities/ai';
import type { TokenUsage } from './utils';

export const aiSessionMessageDeleteFromSeq = defineAction({
  meta: {
    name: 'ai.aiSessionMessage.deleteFromSeq',
    displayName: '删除指定序号及之后的消息',
    description: `删除会话中指定msgSeq及之后的所有消息，用于重新生成回复。

**路径参数：**
- sessionId: 会话的UUID
- msgSeq: 起始消息序号

**使用场景：**
- 用户对AI回复不满意，想要重新生成
- 删除某条消息及其后续所有消息

**自动处理：**
- 更新会话的 messageCount、lastMessageAt、tokenUsage

**示例：**
DELETE /api/ai/session-message/from-seq/session-uuid/10
（删除序号>=10的所有消息）

**返回：**
- deletedCount: 删除的消息数量`,
    tags: ['ai', 'aiSessionMessage'],
    method: 'DELETE',
    path: '/api/ai/session-message/from-seq/:sessionId/:msgSeq',
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

    // 删除 msgSeq 及之后的消息
    const deleted = await db.delete(aiSessionMessage)
      .where(and(
        eq(aiSessionMessage.sessionId, sessionId),
        gte(aiSessionMessage.msgSeq, msgSeq)
      ))
      .returning();

    // 更新会话统计
    if (deleted.length > 0) {
      const deletedTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsage)?.totalTokens ?? 0), 0);
      const deletedPromptTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsage)?.inputTokens ?? 0), 0);
      const deletedCompletionTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsage)?.outputTokens ?? 0), 0);

      // 获取最后一条消息
      const [lastMsg] = await db.select()
        .from(aiSessionMessage)
        .where(eq(aiSessionMessage.sessionId, sessionId))
        .orderBy(desc(aiSessionMessage.msgSeq))
        .limit(1);

      await db.update(aiSession).set({
        messageCount: sql`GREATEST(message_count - ${deleted.length}, 0)`,
        lastMessageAt: lastMsg?.createdAt ?? null,
        tokenUsage: sql`jsonb_set(
          jsonb_set(
            jsonb_set(
              token_usage,
              '{totalTokens}',
              to_jsonb(GREATEST((token_usage->>'totalTokens')::int - ${deletedTokens}, 0))
            ),
            '{promptTokens}',
            to_jsonb(GREATEST((token_usage->>'promptTokens')::int - ${deletedPromptTokens}, 0))
          ),
          '{completionTokens}',
          to_jsonb(GREATEST((token_usage->>'completionTokens')::int - ${deletedCompletionTokens}, 0))
        )`,
        updatedAt: new Date().toISOString(),
      }).where(eq(aiSession.id, sessionId));
    }

    return { deletedCount: deleted.length };
  },
});
