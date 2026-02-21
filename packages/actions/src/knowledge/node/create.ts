/**
 * 创建节点
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeZodSchemas, NODE_TYPES, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, assertNodePermission } from '../utils';
import { nodeCreateBodySchema } from './schemas';

export const nodeCreate = defineAction({
  meta: {
    name: 'knowledge.node.create',
    displayName: '创建节点',
    description: `创建文件夹或文件节点。

**请求体参数：**
- type: 节点类型，必填，"folder" | "file"
- parentId: 父节点ID，可选，null表示根目录
- name: 名称，必填，1-255字符
- description: 描述，可选
- 文件夹特有：icon, color
- 文件特有：extension, mimeType, size, storageKey, bucket, etag, versionId

**权限检查：**
- 如果指定 parentId，需要对父节点有 write 权限

**返回：**
- 创建的节点完整信息

**示例（创建文件夹）：**
\`\`\`json
{
  "type": "folder",
  "parentId": null,
  "name": "我的文档",
  "icon": "folder",
  "color": "#4A90E2"
}
\`\`\``,
    tags: ['knowledge', 'node', 'mutation'],
    method: 'POST',
    path: '/api/knowledge/nodes',
  },
  schemas: {
    bodySchema: nodeCreateBodySchema,
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    let path = '/';
    let materializedPath = '';
    
    if (input.parentId) {
      const [parent] = await db.select().from(node)
        .where(and(eq(node.id, input.parentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER)))
        .limit(1);
      
      if (!parent) {
        throw ActionError.notFound('error.knowledge.parentNotFound');
      }
      
      await assertNodePermission(db, context.currentUserId, parent, 'write');
      
      path = buildPath(parent.path, parent.name);
      materializedPath = buildMaterializedPath(parent.materializedPath, parent.id);
    }
    
    const [result] = await db.insert(node).values({
      type: input.type,
      parentId: input.parentId || null,
      name: input.name,
      path,
      materializedPath,
      description: input.description,
      icon: input.icon,
      color: input.color,
      originalName: input.type === NODE_TYPES.FILE ? input.name : null,
      extension: input.extension,
      mimeType: input.mimeType,
      size: input.size ?? 0,
      storageKey: input.storageKey,
      bucket: input.bucket,
      etag: input.etag,
      versionId: input.versionId,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as NodeInsert).returning();
    
    return result as NodeSelect;
  },
});
