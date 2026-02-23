/**
 * 移动节点 Action
 */

import { eq, and, isNull, sql } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeSchemas, NODE_TYPES, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, isAncestor, assertNodePermission } from '../utils';
import { nodeIdParamsSchema, moveBodySchema } from './schemas';

export const nodeMove = defineAction({
  meta: { 
    name: 'knowledge.node.move', 
    displayName: '移动节点', 
    description: `移动节点到目标文件夹。

**路径参数：**
- id: 要移动的节点UUID

**请求体参数：**
- targetParentId: 目标父节点ID，null表示移动到根目录

**权限检查：**
- 需要对源节点有 write 权限
- 需要对目标文件夹有 write 权限

**限制：**
- 不能移动到自身
- 文件夹不能移动到自己的后代节点

**返回：**
- 移动后的节点完整信息

**示例：**
\`\`\`json
{
  "targetParentId": "target-folder-uuid"
}
\`\`\``, 
    tags: ['knowledge', 'operations'], 
    method: 'POST', 
    path: '/api/knowledge/nodes/:id/move' 
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    bodySchema: moveBodySchema,
    outputSchema: nodeSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    if (input.targetParentId === input.id) {
      throw ActionError.badRequest('error.knowledge.cannotMoveToSelf');
    }
    
    const [existing] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!existing) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }
    
    await assertNodePermission(db, context.currentUserId, existing, 'write');
    
    let newPath = '/';
    let newMaterializedPath = '';
    
    if (input.targetParentId) {
      const [targetParent] = await db.select().from(node)
        .where(and(eq(node.id, input.targetParentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER)))
        .limit(1);
      
      if (!targetParent) {
        throw ActionError.notFound('error.knowledge.targetNotFound');
      }
      
      await assertNodePermission(db, context.currentUserId, targetParent, 'write');
      
      if (existing.type === NODE_TYPES.FOLDER && isAncestor(targetParent.materializedPath, existing.id)) {
        throw ActionError.badRequest('error.knowledge.cannotMoveToDescendant');
      }
      
      newPath = buildPath(targetParent.path, targetParent.name);
      newMaterializedPath = buildMaterializedPath(targetParent.materializedPath, targetParent.id);
    }
    
    const [result] = await db.update(node)
      .set({
        parentId: input.targetParentId,
        path: newPath,
        materializedPath: newMaterializedPath,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(node.id, input.id))
      .returning();
    
    // 更新子节点的 materializedPath
    if (existing.type === NODE_TYPES.FOLDER) {
      const oldChildPath = existing.materializedPath ? existing.materializedPath + '/' + existing.id : existing.id;
      const newChildPath = newMaterializedPath ? newMaterializedPath + '/' + existing.id : existing.id;
      await db.execute(sql`UPDATE knowledge_node SET materialized_path = REPLACE(materialized_path, ${oldChildPath}, ${newChildPath}) WHERE materialized_path LIKE ${oldChildPath + '%'} AND deleted_at IS NULL`);
    }
    
    return result as NodeSelect;
  },
});
