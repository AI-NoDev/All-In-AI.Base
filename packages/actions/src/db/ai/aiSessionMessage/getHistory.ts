/**
 * 获取会话历史
 */

import { t } from 'elysia';
import { eq, and, lte, desc } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSessionMessage } from '@qiyu-allinai/db/entities/ai';
import { aiSessionMessageSchemas, type AISessionMessageSelect } from './schemas';

export const aiSessionMessageGetHistory = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.aiSessionMessage.getHistory',
    displayName: '获取会话历史',
    description: `获取指定会话的消息历史，支持分页加载更早的消息。

**路径参数：**
- sessionId: 会话的UUID

**查询参数：**
- limit: 返回消息数量，1-200，默认50
- beforeSeq: 获取此序号之前的消息（用于加载更早的历史）

**返回：** 消息数组，按序号升序排列

**使用场景：**
1. 初始加载会话消息
2. 滚动加载更早的历史消息

**示例：**
\`\`\`
GET /api/ai/session-message/history/session-uuid?limit=50
GET /api/ai/session-message/history/session-uuid?limit=20&beforeSeq=100
\`\`\``,
    tags: ['ai', 'aiSessionMessage'],
    method: 'GET',
    path: '/api/ai/session-message/history/:sessionId',
  },
  schemas: {
    paramsSchema: t.Object({ sessionId: t.String() }),
    querySchema: t.Optional(t.Object({
      limit: t.Number({ minimum: 1, maximum: 200, default: 50 }),
      beforeSeq: t.Optional(t.Number()),
    })),
    outputSchema: t.Array(aiSessionMessageSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const conditions = [eq(aiSessionMessage.sessionId, input.sessionId)];
    
    if (input.beforeSeq !== undefined) {
      conditions.push(lte(aiSessionMessage.msgSeq, input.beforeSeq));
    }

    const data = await db.select().from(aiSessionMessage)
      .where(and(...conditions))
      .orderBy(desc(aiSessionMessage.msgSeq))
      .limit(input.limit ?? 50);

    // 返回升序排列
    return (data as AISessionMessageSelect[]).reverse();
  },
});
