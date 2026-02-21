/**
 * 批量删除节点
 */

import { z } from 'zod';
import { eq, and, isNull, sql, inArray } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, NODE_TYPES } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';

export const nodeDeleteMany = defineAction({
  meta: {
    name: 'knowledge.node.deleteMany',
    displayName: '批量删除节点',
    description: `批量软删除多个节点。

**请求体参数：**
- ids: 节点ID数组

**权限检查：**
- 逐个检查 delete 权限，无权限的节点会被跳过

**行为：**
- 软删除：设置 deletedAt 时间戳
- 文件夹：递归删除所有后代节点

**返回：**
- deletedCount: 实际删除的节点数量

**示例：**
\`\`\`json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
\`\`\``,
    tags: ['knowledge', 'node', 'mutation'],
    method: 'POST',
    path: '/api/knowledge/nodes/delete-batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()) }),
    outputSchema: z.object({ deletedCount: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const now = new Date().toISOString();
    
    const nodes = await db.select().from(node)
      .where(and(inArray(node.id, input.ids), isNull(node.deletedAt)));
    
    let deletedCount = 0;
    
    for (const n of nodes) {
      try {
        await assertNodePermission(db, context.currentUserId, n, 'delete');
        
        await db.update(node)
          .set({
            deletedAt: now,
            deletedById: context.currentUserId,
            deletedBy: context.currentUserName,
          })
          .where(eq(node.id, n.id));
        
        deletedCount++;
        
        if (n.type === NODE_TYPES.FOLDER) {
          const childPath = `${n.materializedPath ? n.materializedPath + '/' : ''}${n.id}`;
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
      } catch {
        // 跳过没有权限的节点
      }
    }
    
    return { deletedCount };
  },
});
