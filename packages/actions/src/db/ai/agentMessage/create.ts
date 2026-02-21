/**
 * 创建Agent消息
 */

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentMessage, agentSession } from '@qiyu-allinai/db/entities/ai';
import { agentMessageZodSchemas } from './schemas';
import type { AgentMessageSelect, AgentMessageInsert } from './utils';

export const agentMessageCreate = defineAction({
  meta: {
    name: 'ai.agentMessage.create',
    displayName: '创建Agent消息',
    description: `创建单条Agent消息记录，自动分配消息序号并更新会话统计。

**必填字段：**
- sessionId: 所属会话ID
- role: 消息角色，"user" | "assistant" | "system" | "tool"
- content: 消息内容

**可选字段：**
- contentType: 内容类型，默认 "text"
- tokenUsage: Token使用统计 { totalTokens, inputTokens, outputTokens }
- finishReason: 完成原因，如 "stop"、"length"
- metadata: 元数据

**自动处理：**
- msgSeq: 自动分配递增序号
- 更新会话的 messageCount、lastMessageAt、tokenUsage

**使用场景：**
1. 用户发送消息
2. AI回复消息
3. 系统消息

**示例：**
\`\`\`json
{
  "data": {
    "sessionId": "session-uuid",
    "role": "user",
    "content": "你好，请帮我分析这段代码",
    "contentType": "text"
  }
}
\`\`\``,
    tags: ['ai', 'agentMessage'],
    method: 'POST',
    path: '/api/ai/agent-message',
  },
  schemas: {
    bodySchema: z.object({ data: agentMessageZodSchemas.insert.omit({ msgSeq: true }) }),
    outputSchema: agentMessageZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    // Get next msgSeq for session
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(agentMessage).where(eq(agentMessage.sessionId, input.data.sessionId));
    const nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;

    const [result] = await db.insert(agentMessage)
      .values({ ...input.data, msgSeq: nextSeq } as AgentMessageInsert)
      .returning();

    // Update session stats
    if (result) {
      const usage = input.data.tokenUsage;
      const totalTokens = usage?.totalTokens ?? 0;
      const inputTokens = usage?.inputTokens ?? 0;
      const outputTokens = usage?.outputTokens ?? 0;

      await db.update(agentSession).set({
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
      }).where(eq(agentSession.id, input.data.sessionId));
    }

    return result as AgentMessageSelect;
  },
});
