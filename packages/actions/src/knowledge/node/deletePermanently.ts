/**
 * 永久删除节点
 */

import { defineAction } from '../../core/define';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { KnowledgePermissionAdapter } from '@qiyu-allinai/db/casbin';
import { t } from 'elysia';
import { eq, and, isNotNull, sql, inArray } from 'drizzle-orm';

export const nodeDeletePermanently = defineAction({
  meta: {
    name: 'knowledge.node.deletePermanently',
    displayName: '永久删除节点',
    description: `永久删除回收站中的节点。

**请求体参数：**
- ids: 节点ID数组

**权限检查：**
- 需要对该节点有 delete 权限

**行为：**
- 永久删除：从数据库物理删除
- 文件夹：递归删除所有后代节点
- 权限：清理相关权限记录

**返回：**
- deletedCount: 删除的节点数量`,
    tags: ['knowledge', 'node', 'mutation'],
    method: 'DELETE',
    path: '/api/knowledge/nodes/recycle-bin/delete',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()) }),
    outputSchema: t.Object({ deletedCount: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    if (!input.ids.length) {
      return { deletedCount: 0 };
    }

    // 查询所有待删除的节点 (必须在回收站中，且是当前用户删除的)
    const nodes = await db.select().from(node)
      .where(and(
        inArray(node.id, input.ids),
        isNotNull(node.deletedAt),
        eq(node.deletedById, context.currentUserId)
      ));
    
    if (nodes.length === 0) {
      return { deletedCount: 0 };
    }

    let deletedCount = 0;
    const permissionAdapter = new KnowledgePermissionAdapter(db);
    
    for (const n of nodes) {
      try {
        // 检查权限
        if (n.deletedById !== context.currentUserId) {
             // await assertNodePermission(db, context.currentUserId, n, 'delete');
        }
        
        // 1. 获取所有需要删除的节点ID (如果是文件夹，包含子节点)
        let idsToDelete: string[] = [n.id];
        
        if (n.type === 'folder') {
          const childPath = `${n.materializedPath ? n.materializedPath + '/' : ''}${n.id}`;
          
          const children = await db.select({ id: node.id }).from(node)
            .where(sql`${node.materializedPath} LIKE ${childPath + '%'}`);
          
          if (children.length > 0) {
            idsToDelete = idsToDelete.concat(children.map(c => c.id));
          }
        }
        
        // 2. 清理权限
        for (const id of idsToDelete) {
           await permissionAdapter.deleteNodePermissions(id);
        }
        
        // 3. 物理删除
        const result = await db.delete(node)
          .where(inArray(node.id, idsToDelete))
          .returning({ id: node.id });
        
        if (Array.isArray(result)) {
            deletedCount += result.length;
        }

      } catch (e) {
        console.error(`Failed to delete node ${n.id} permanently:`, e);
      }
    }
    
    return { deletedCount };
  },
});
