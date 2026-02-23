/**
 * 根据ID查询AI会话
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSession } from '@qiyu-allinai/db/entities/ai';
import { aiSessionSchemas, type AISessionSelect } from './schemas';

export const aiSessionGetByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.aiSession.getByPk',
    displayName: '根据ID查询AI会话',
    description: `根据主键ID查询单个AI会话的详细信息。

**路径参数：**
- id: 会话的UUID

**返回：**
- 找到时返回完整的会话对象（包含消息统计、token使用量等）
- 未找到或已删除时返回 null

**示例：**
GET /api/ai/session/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'aiSession'],
    method: 'GET',
    path: '/api/ai/session/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([aiSessionSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(aiSession)
      .where(and(eq(aiSession.id, input.id), isNull(aiSession.deletedAt)))
      .limit(1);
    return (result as AISessionSelect) ?? null;
  },
});
