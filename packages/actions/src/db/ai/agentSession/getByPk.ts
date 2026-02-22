/**
 * 根据ID查询Agent会话
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentSession } from '@qiyu-allinai/db/entities/ai';
import { agentSessionZodSchemas } from './schemas';
import type { AgentSessionSelect } from './utils';

export const agentSessionGetByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.agentSession.getByPk',
    displayName: '根据ID查询Agent会话',
    description: `根据主键ID查询单个Agent会话详情。

**参数说明：**
- id: 会话的UUID主键

**返回值：**
- 成功：返回会话完整信息（id, agentId, userId, title, messageCount, tokenUsage, lastMessageAt等）
- 未找到或已删除：返回 null

**使用场景：**
1. 进入会话详情页
2. 获取会话的统计信息（消息数、Token使用量）
3. 验证会话是否存在

**示例：**
GET /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'agentSession'],
    method: 'GET',
    path: '/api/ai/agent-session/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: agentSessionZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(agentSession)
      .where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt)))
      .limit(1);
    return (result as AgentSessionSelect) ?? null;
  },
});
