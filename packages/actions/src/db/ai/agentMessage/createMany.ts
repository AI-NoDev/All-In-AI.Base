/**
 * 批量创建Agent消息
 */

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentMessage, agentSession } from '@qiyu-allinai/db/entities/ai';
import { agentMessageZodSchemas } from './schemas';
import type { AgentMessageSelect, AgentMessageInsert } from './utils';

export const agentMessageCreateMany = defineAction({
  meta: {
    name: 'ai.agentMessage.createMany',
    displayName: '批量创建Agent消息',
    description: `批量创建Agent消息，自动分配递增序号并更新会话统计。

**参数说明：**
- sessionId: 目标会话ID
- messages: 消息数组（不需要包含 sessionId 和 msgSeq）

**自动处理：**
- 为每条消息分配递增的 msgSeq
- 更新会话的 messageCount、lastMessageAt、tokenUsage

**使用场景：**
1. 导入历史对话
2. 一次性添加多轮对话
3. 批量添加系统消息

**示例：**
\`\`\`json
{
  "sessionId": "session-uuid",
  "messages": [
    { "role": "user", "content": "你好" },
    { "role": "assistant", "content": "你好！有什么可以帮助你的？" }
  ]
}
\`\`\``,
    tags: ['ai', 'agentMessage'],
    method: 'POST',
    path: '/api/ai/agent-message/batch',
  },
  schemas: {
    bodySchema: z.object({
      sessionId: z.string(),
      messages: z.array(agentMessageZodSchemas.insert.omit({ sessionId: true, msgSeq: true })),
    }),
    outputSchema: z.array(agentMessageZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { sessionId, messages } = input;

    // Get current max msgSeq
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(agentMessage).where(eq(agentMessage.sessionId, sessionId));
    let nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;

    // Prepare messages with sequential msgSeq
    const messagesToInsert = messages.map(msg => ({
      ...msg,
      sessionId,
      msgSeq: nextSeq++,
    })) as AgentMessageInsert[];

    const results = await db.insert(agentMessage).values(messagesToInsert).returning();

    // Update session stats
    const totalTokens = messages.reduce((sum, m) => sum + (m.tokenUsage?.totalTokens ?? 0), 0);
    const promptTokens = messages.reduce((sum, m) => sum + (m.tokenUsage?.inputTokens ?? 0), 0);
    const completionTokens = messages.reduce((sum, m) => sum + (m.tokenUsage?.outputTokens ?? 0), 0);
    const lastMessage = results[results.length - 1];

    if (lastMessage) {
      await db.update(agentSession).set({
        messageCount: sql`message_count + ${messages.length}`,
        lastMessageAt: lastMessage.createdAt,
        tokenUsage: sql`jsonb_set(
          jsonb_set(
            jsonb_set(
              token_usage,
              '{totalTokens}',
              to_jsonb((token_usage->>'totalTokens')::int + ${totalTokens})
            ),
            '{promptTokens}',
            to_jsonb((token_usage->>'promptTokens')::int + ${promptTokens})
          ),
          '{completionTokens}',
          to_jsonb((token_usage->>'completionTokens')::int + ${completionTokens})
        )`,
        updatedAt: new Date().toISOString(),
      }).where(eq(agentSession.id, sessionId));
    }

    return results as AgentMessageSelect[];
  },
});
