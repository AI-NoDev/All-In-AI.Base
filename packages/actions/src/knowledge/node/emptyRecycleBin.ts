import { defineAction } from '../../core/define';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { KnowledgePermissionAdapter } from '@qiyu-allinai/db/casbin';
import { t } from 'elysia';
import { eq, and, isNotNull, inArray } from 'drizzle-orm';

export const nodeEmptyRecycleBin = defineAction({
  meta: {
    name: 'knowledge.node.emptyRecycleBin',
    displayName: '清空回收站',
    description: `清空当前用户的回收站（永久删除所有已删除节点）。`,
    tags: ['knowledge', 'node', 'mutation'],
    method: 'DELETE',
    path: '/api/knowledge/nodes/recycle-bin',
  },
  schemas: {
    outputSchema: t.Object({ deletedCount: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 1. 查询当前用户删除的所有节点
    const nodes = await db.select({ id: node.id }).from(node)
      .where(and(
        isNotNull(node.deletedAt),
        eq(node.deletedById, context.currentUserId)
      ));
      
    if (nodes.length === 0) {
        return { deletedCount: 0 };
    }
    
    const ids = nodes.map(n => n.id);
    const permissionAdapter = new KnowledgePermissionAdapter(db);
    
    // 2. 清理权限
    for (const id of ids) {
        await permissionAdapter.deleteNodePermissions(id);
    }
    
    // 3. 物理删除
    // 分批删除以避免 SQL 参数过多
    const BATCH_SIZE = 1000;
    let deletedCount = 0;
    
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batchIds = ids.slice(i, i + BATCH_SIZE);
        const result = await db.delete(node)
          .where(inArray(node.id, batchIds))
          .returning({ id: node.id });
        deletedCount += result.length;
    }
      
    return { deletedCount };
  },
});
