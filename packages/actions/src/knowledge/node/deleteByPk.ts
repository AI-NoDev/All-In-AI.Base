/**
 * 删除节点
 */

import { z } from 'zod';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, NODE_TYPES } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';

export const nodeDelete = defineAction({
  meta: {
    name: 'knowledge.node.delete',
    displayName: '删除节点',
    description: `软删除节点（文件夹会递归删除所有子节点）。

**路径参数：**
- id: 节点UUID

**权限检查：**
- 需要对该节点有 delete 权限

**行为：**
- 软删除：设置 deletedAt 时间戳，不物理删除
- 文件夹：递归删除所有后代节点（使用物化路径批量更新）

**返回：**
- success: 是否成功
- deletedCount: 删除的节点数量（包括子节点）

**示例：**
DELETE /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['knowledge', 'node', 'mutation'],
    method: 'DELETE',
    path: '/api/knowledge/nodes/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({ success: z.boolean(), deletedCount: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const now = new Date().toISOString();
    
    const [existing] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!existing) {
      return { success: false, deletedCount: 0 };
    }
    
    await assertNodePermission(db, context.currentUserId, existing, 'delete');
    
    let deletedCount = 1;
    
    await db.update(node)
      .set({
        deletedAt: now,
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(eq(node.id, input.id));
    
    if (existing.type === NODE_TYPES.FOLDER) {
      const childPath = `${existing.materializedPath ? existing.materializedPath + '/' : ''}${existing.id}`;
      
      const result = await db.update(node)
        .set({
          deletedAt: now,
          deletedById: context.currentUserId,
          deletedBy: context.currentUserName,
        })
        .where(and(
          sql`${node.materializedPath} LIKE ${childPath + '%'}`,
          isNull(node.deletedAt)
        ))
        .returning({ id: node.id });
      
      deletedCount += result.length;
    }
    
    return { success: true, deletedCount };
  },
});
