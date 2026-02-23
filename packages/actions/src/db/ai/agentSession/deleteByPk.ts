/**
 * 删除Agent会话
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentSession } from '@qiyu-allinai/db/entities/ai';

export const agentSessionDeleteByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.agentSession.deleteByPk',
    displayName: '删除Agent会话',
    description: `根据ID软删除Agent会话（逻辑删除，数据保留）。

**参数说明：**
- id: 会话UUID

**删除行为：**
- 软删除：设置 deletedAt、deletedBy、deletedById
- 数据保留在数据库中
- 查询时自动过滤已删除记录

**返回值：**
- true: 删除成功
- false: 会话不存在或已删除

**注意事项：**
- 删除会话后，关联的消息记录仍然保留
- 如需彻底清理，需要单独删除消息

**示例：**
DELETE /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'agentSession'],
    method: 'DELETE',
    path: '/api/ai/agent-session/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agentSession)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt)))
      .returning();
    return !!result;
  },
});
