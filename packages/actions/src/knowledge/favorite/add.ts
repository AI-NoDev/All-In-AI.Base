/**
 * 添加收藏 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { favorite, node, type FavoriteSelect, type FavoriteInsert } from '@qiyu-allinai/db/entities/knowledge';
import { addFavoriteBodySchema, favoriteZodSchemas } from './schemas';

export const favoriteAdd = defineAction({
  meta: {
    name: 'knowledge.favorite.add',
    displayName: '添加收藏',
    description: `收藏知识库节点（文件或文件夹）。

**请求体参数：**
- nodeId: 节点UUID，必填

**行为：**
- 如果已收藏，返回现有收藏记录（幂等操作）
- 自动获取节点类型（folder/file）

**返回：**
- 收藏记录完整信息

**示例：**
\`\`\`json
{
  "nodeId": "550e8400-e29b-41d4-a716-446655440000"
}
\`\`\``,
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorites',
  },
  schemas: {
    bodySchema: addFavoriteBodySchema,
    outputSchema: favoriteZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 获取节点类型
    const [nodeRecord] = await db.select({ type: node.type }).from(node)
      .where(and(eq(node.id, input.nodeId), isNull(node.deletedAt)))
      .limit(1);
    
    const resourceType = nodeRecord?.type || 'file';
    
    const [result] = await db.insert(favorite).values({
      userId: context.currentUserId,
      resourceType,
      resourceId: input.nodeId,
      createdById: context.currentUserId,
      createdBy: context.currentUserName,
      updatedById: context.currentUserId,
      updatedBy: context.currentUserName,
    } as FavoriteInsert).onConflictDoNothing().returning();
    
    if (!result) {
      const [existing] = await db.select().from(favorite).where(
        and(
          eq(favorite.userId, context.currentUserId),
          eq(favorite.resourceId, input.nodeId)
        )
      );
      return existing as FavoriteSelect;
    }
    return result as FavoriteSelect;
  },
});
