/**
 * 获取收藏列表 Action
 */

import { eq, and, sql, inArray, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { favorite, node } from '@qiyu-allinai/db/entities/knowledge';
import { listFavoriteBodySchema, listFavoriteOutputSchema } from './schemas';

export const favoriteList = defineAction({
  meta: {
    name: 'knowledge.favorite.list',
    displayName: '获取收藏列表',
    description: `获取当前用户的收藏列表（带节点详情）。

**请求体参数：**
- type: 节点类型筛选，可选 "folder" | "file"
- limit: 每页数量，默认50，最大100
- offset: 偏移量，默认0

**返回：**
- data: 收藏项数组，包含节点详情
  - favoriteId: 收藏记录ID
  - nodeId: 节点ID
  - type: 节点类型
  - name: 名称
  - parentId: 父节点ID
  - icon, color, extension, mimeType, size
  - createdAt: 节点创建时间
  - favoritedAt: 收藏时间
- total: 总数

**示例：**
\`\`\`json
{
  "type": "file",
  "limit": 20,
  "offset": 0
}
\`\`\``,
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorites/list',
  },
  schemas: {
    bodySchema: listFavoriteBodySchema,
    outputSchema: listFavoriteOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const conditions = [eq(favorite.userId, context.currentUserId)];
    
    if (input.type) {
      conditions.push(eq(favorite.resourceType, input.type));
    }
    
    // 获取收藏记录
    const favorites = await db.select().from(favorite)
      .where(and(...conditions))
      .limit(input.limit)
      .offset(input.offset);
    
    if (favorites.length === 0) {
      return { data: [], total: 0 };
    }
    
    // 获取节点详情
    const nodeIds = favorites.map(f => f.resourceId);
    const nodes = await db.select().from(node)
      .where(and(inArray(node.id, nodeIds), isNull(node.deletedAt)));
    
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    const data = favorites
      .map(f => {
        const n = nodeMap.get(f.resourceId);
        if (!n) return null;
        return {
          favoriteId: f.id,
          nodeId: n.id,
          type: n.type as 'folder' | 'file',
          name: n.name,
          parentId: n.parentId,
          icon: n.icon,
          color: n.color,
          extension: n.extension,
          mimeType: n.mimeType,
          size: n.size,
          createdAt: n.createdAt,
          favoritedAt: f.createdAt,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    
    // 获取总数
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(favorite)
      .where(and(...conditions));
    
    return { data, total: Number(countResult[0]?.count ?? 0) };
  },
});
