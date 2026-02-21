/**
 * 取消收藏 Action
 */

import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { favorite } from '@qiyu-allinai/db/entities/knowledge';
import { nodeIdParamsSchema, successOutputSchema } from './schemas';

export const favoriteRemove = defineAction({
  meta: {
    name: 'knowledge.favorite.remove',
    displayName: '取消收藏',
    description: `取消收藏知识库节点。

**路径参数：**
- nodeId: 节点UUID

**返回：**
- success: 是否成功（true表示已取消，false表示未找到收藏记录）

**示例：**
DELETE /api/knowledge/favorites/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['knowledge', 'favorite'],
    method: 'DELETE',
    path: '/api/knowledge/favorites/:nodeId',
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    outputSchema: successOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const result = await db.delete(favorite).where(
      and(
        eq(favorite.userId, context.currentUserId),
        eq(favorite.resourceId, input.nodeId)
      )
    ).returning();
    return { success: result.length > 0 };
  },
});
