/**
 * 根据ID查询AI会话消息
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSessionMessage } from '@qiyu-allinai/db/entities/ai';
import { aiSessionMessageSchemas, type AISessionMessageSelect } from './schemas';

export const aiSessionMessageGetByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.aiSessionMessage.getByPk',
    displayName: '根据ID查询AI会话消息',
    description: `根据主键ID查询单条AI会话消息的详细信息。

**路径参数：**
- id: 消息的UUID

**返回：**
- 找到时返回完整的消息对象（包含内容、token使用量等）
- 未找到时返回 null

**示例：**
GET /api/ai/session-message/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'aiSessionMessage'],
    method: 'GET',
    path: '/api/ai/session-message/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([aiSessionMessageSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(aiSessionMessage)
      .where(eq(aiSessionMessage.id, input.id))
      .limit(1);
    return (result as AISessionMessageSelect) ?? null;
  },
});
