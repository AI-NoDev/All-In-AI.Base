/**
 * 批量创建AI会话消息
 */

import { t } from 'elysia';
import { eq, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSessionMessage, aiSession } from '@qiyu-allinai/db/entities/ai';
import { aiSessionMessageSchemas, type AISessionMessageSelect, type AISessionMessageInsert, type TokenUsage } from './schemas';

export const aiSessionMessageCreateMany = defineAction({
  meta: {
    name: 'ai.aiSessionMessage.createMany',
    ignoreTools: true,
    displayName: '批量创建AI会话消息',
    description: `批量创建多条AI会话消息，自动分配递增序号并更新会话统计。

**请求体：**
- sessionId: 所属会话ID
- messages: 消息对象数组（不需要指定 sessionId 和 msgSeq）

**使用场景：**
- 导入历史对话
- 一次性添加多轮对话

**示例：**
\`\`\`json
{
  "sessionId": "session-uuid",
  "messages": [
    { "role": "user", "content": "你好" },
    { "role": "assistant", "content": "你好！有什么可以帮助你的吗？" }
  ]
}
\`\`\`

**返回：** 创建成功的消息对象数组`,
    tags: ['ai', 'aiSessionMessage'],
    method: 'POST',
    path: '/api/ai/session-message/batch',
  },
  schemas: {
    bodySchema: t.Object({
      sessionId: t.String(),
      messages: t.Array(t.Omit(aiSessionMessageSchemas.insert, ['sessionId', 'msgSeq'])),
    }),
    outputSchema: t.Array(aiSessionMessageSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { sessionId, messages } = input;

    // 获取当前最大序号
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(aiSessionMessage)
      .where(eq(aiSessionMessage.sessionId, sessionId));
    let nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;

    // 准备消息数据
    const messagesToInsert = messages.map(msg => ({
      ...msg,
      sessionId,
      msgSeq: nextSeq++,
    })) as AISessionMessageInsert[];

    const results = await db.insert(aiSessionMessage).values(messagesToInsert).returning();

    // 更新会话统计
    const totalTokens = messages.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsage)?.totalTokens ?? 0), 0);
    const promptTokens = messages.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsage)?.inputTokens ?? 0), 0);
    const completionTokens = messages.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsage)?.outputTokens ?? 0), 0);
    const lastMessage = results[results.length - 1];

    if (lastMessage) {
      await db.update(aiSession).set({
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
      }).where(eq(aiSession.id, sessionId));
    }

    return results as AISessionMessageSelect[];
  },
});
