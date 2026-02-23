/**
 * 创建AI会话消息
 */

import { t } from 'elysia';
import { eq, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSessionMessage, aiSession } from '@qiyu-allinai/db/entities/ai';
import { aiSessionMessageSchemas, type AISessionMessageSelect, type AISessionMessageInsert, type TokenUsage } from './schemas';

export const aiSessionMessageCreate = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.aiSessionMessage.create',
    displayName: '创建AI会话消息',
    description: `创建单条AI会话消息，自动分配消息序号并更新会话统计。

**必填字段：**
- sessionId: 所属会话ID
- role: 消息角色，user=用户消息，assistant=AI回复，system=系统消息
- content: 消息内容

**可选字段：**
- contentType: 内容类型，默认text
- tokenUsage: token使用量统计
- finishReason: 完成原因（AI回复时）
- metadata: 元数据

**自动处理：**
- msgSeq: 自动分配递增序号
- 更新会话的 messageCount、lastMessageAt、tokenUsage

**示例：**
\`\`\`json
{
  "data": {
    "sessionId": "session-uuid",
    "role": "user",
    "content": "你好，请介绍一下React"
  }
}
\`\`\``,
    tags: ['ai', 'aiSessionMessage'],
    method: 'POST',
    path: '/api/ai/session-message',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Omit(aiSessionMessageSchemas.insert, ['msgSeq']) }),
    outputSchema: aiSessionMessageSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 获取下一个消息序号
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(aiSessionMessage)
      .where(eq(aiSessionMessage.sessionId, input.data.sessionId));
    const nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;

    const [result] = await db.insert(aiSessionMessage)
      .values({ ...input.data, msgSeq: nextSeq } as AISessionMessageInsert)
      .returning();

    // 更新会话统计
    if (result) {
      const usage = input.data.tokenUsage as TokenUsage | undefined;
      const totalTokens = usage?.totalTokens ?? 0;
      const inputTokens = usage?.inputTokens ?? 0;
      const outputTokens = usage?.outputTokens ?? 0;
      
      await db.update(aiSession).set({
        messageCount: sql`message_count + 1`,
        lastMessageAt: result.createdAt,
        tokenUsage: sql`jsonb_set(
          jsonb_set(
            jsonb_set(
              token_usage,
              '{totalTokens}',
              to_jsonb((token_usage->>'totalTokens')::int + ${totalTokens})
            ),
            '{promptTokens}',
            to_jsonb((token_usage->>'promptTokens')::int + ${inputTokens})
          ),
          '{completionTokens}',
          to_jsonb((token_usage->>'completionTokens')::int + ${outputTokens})
        )`,
        updatedAt: new Date().toISOString(),
      }).where(eq(aiSession.id, input.data.sessionId));
    }

    return result as AISessionMessageSelect;
  },
});
