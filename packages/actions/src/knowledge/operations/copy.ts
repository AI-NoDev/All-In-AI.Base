/**
 * 复制节点 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeSchemas, NODE_TYPES, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, assertNodePermission, generateUniqueName, parseFileName } from '../utils';
import { nodeIdParamsSchema, copyBodySchema } from './schemas';

export const nodeCopy = defineAction({
  meta: { 
    name: 'knowledge.node.copy', 
    displayName: '复制节点', 
    description: `复制节点到目标文件夹（自动处理重名）。

**路径参数：**
- id: 要复制的节点UUID

**请求体参数：**
- targetParentId: 目标父节点ID，null表示复制到根目录

**权限检查：**
- 需要对源节点有 read 权限
- 需要对目标文件夹有 write 权限

**行为：**
- 如果目标位置存在同名文件，自动重命名（如 "file (1).txt"）
- 复制文件的存储引用，不复制实际文件内容

**返回：**
- 复制后的新节点完整信息

**示例：**
\`\`\`json
{
  "targetParentId": "target-folder-uuid"
}
\`\`\``, 
    tags: ['knowledge', 'operations'], 
    method: 'POST', 
    path: '/api/knowledge/nodes/:id/copy' 
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    bodySchema: copyBodySchema,
    outputSchema: nodeSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [existing] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!existing) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }
    
    await assertNodePermission(db, context.currentUserId, existing, 'read');
    
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
      newPath = buildPath(targetParent.path, targetParent.name);
      newMaterializedPath = buildMaterializedPath(targetParent.materializedPath, targetParent.id);
    }
    
    // 获取目标位置已存在的名称
    const parentCondition = input.targetParentId === null ? isNull(node.parentId) : eq(node.parentId, input.targetParentId);
    const existingNodes = await db.select({ name: node.name }).from(node)
      .where(and(parentCondition, isNull(node.deletedAt)));
    const existingNames = new Set(existingNodes.map(n => n.name));
    
    // 生成唯一名称
    const { baseName, extension } = parseFileName(existing.name);
    const newName = generateUniqueName(baseName, extension, existingNames);
    
    const [result] = await db.insert(node).values({
      type: existing.type,
      parentId: input.targetParentId,
      name: newName,
      path: newPath,
      materializedPath: newMaterializedPath,
      description: existing.description,
      icon: existing.icon,
      color: existing.color,
      originalName: existing.type === NODE_TYPES.FILE ? newName : null,
      extension: existing.extension,
      mimeType: existing.mimeType,
      size: existing.size,
      storageKey: existing.storageKey,
      bucket: existing.bucket,
      etag: existing.etag,
      versionId: existing.versionId,
      tags: existing.tags,
      isPublic: existing.isPublic,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as NodeInsert).returning();
    
    return result as NodeSelect;
  },
});
