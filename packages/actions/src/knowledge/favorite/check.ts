/**
 * 检查收藏状态 Action
 */

import { eq, and, inArray } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { favorite } from '@qiyu-allinai/db/entities/knowledge';
import { checkFavoriteBodySchema, checkFavoriteOutputSchema } from './schemas';

export const favoriteCheck = defineAction({
  meta: {
    name: 'knowledge.favorite.check',
    displayName: '检查收藏状态',
    description: `批量检查节点是否已收藏。

**请求体参数：**
- nodeIds: 节点ID数组，必填

**返回：**
- favorites: 收藏状态映射 { nodeId: boolean }

**使用场景：**
- 文件列表显示收藏状态
- 批量操作前检查

**示例：**
\`\`\`json
{
  "nodeIds": ["uuid1", "uuid2", "uuid3"]
}
\`\`\`

**响应：**
\`\`\`json
{
  "favorites": {
    "uuid1": true,
    "uuid2": false,
    "uuid3": true
  }
}
\`\`\``,
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorites/check',
  },
  schemas: {
    bodySchema: checkFavoriteBodySchema,
    outputSchema: checkFavoriteOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const results = await db.select({ resourceId: favorite.resourceId })
      .from(favorite)
      .where(and(
        eq(favorite.userId, context.currentUserId),
        inArray(favorite.resourceId, input.nodeIds)
      ));
    
    const favoriteSet = new Set(results.map(r => r.resourceId));
    const favorites: Record<string, boolean> = {};
    
    for (const nodeId of input.nodeIds) {
      favorites[nodeId] = favoriteSet.has(nodeId);
    }
    
    return { favorites };
  },
});
