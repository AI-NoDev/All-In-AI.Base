/**
 * 删除AI会话
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { aiSession } from '@qiyu-allinai/db/entities/ai';

export const aiSessionDelete = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.aiSession.delete',
    displayName: '删除AI会话',
    description: `软删除AI会话。

**路径参数：**
- id: 会话的UUID

**注意事项：**
- 软删除，数据保留但标记为已删除
- 会话下的消息不会被删除，但会话不再显示

**返回：**
- success: true 表示删除成功

**示例：**
DELETE /api/ai/session/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'aiSession'],
    method: 'DELETE',
    path: '/api/ai/session/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Object({ success: t.Boolean() }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    await db.update(aiSession)
      .set({
        deletedAt: new Date().toISOString(),
        deletedBy: currentUserId,
      })
      .where(eq(aiSession.id, input.id));
    return { success: true };
  },
});
