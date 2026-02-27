/**
 * 创建节点
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeSchemas, NODE_TYPES, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, assertNodePermission } from '../utils';
import { nodeCreateBodySchema } from './schemas';
import { generateStorageKey, uploadFile, DEFAULT_BUCKET } from '../../files/s3Client';

export const nodeCreate = defineAction({
  meta: {
    name: 'knowledge.node.create',
    displayName: '创建节点',
    description: `创建文件夹或文件节点。

**使用方式：**
1. 创建文件夹：type="folder"，直接调用即可
2. 创建空文件：type="file"，无需提供storageKey，系统自动生成

**请求体参数：**
- type: 节点类型，必填，"folder" | "file"
- parentId: 父节点ID，可选，null表示根目录
- name: 名称，必填，1-255字符
- description: 描述，可选
- 文件夹特有：icon, color
- 文件特有（可选）：extension, mimeType, size, storageKey, bucket

**权限检查：**
- 如果指定 parentId，需要对父节点有 write 权限

**返回：**
- 创建的节点完整信息

**示例（创建文件夹）：**
\`\`\`json
{
  "type": "folder",
  "parentId": null,
  "name": "我的文档"
}
\`\`\`

**示例（创建Markdown文件）：**
\`\`\`json
{
  "type": "file",
  "parentId": "folder-uuid",
  "name": "readme.md",
  "extension": "md",
  "mimeType": "text/markdown"
}
\`\`\``,
    tags: ['knowledge', 'node', 'mutation'],
    method: 'POST',
    path: '/api/knowledge/nodes',
  },
  schemas: {
    bodySchema: nodeCreateBodySchema,
    outputSchema: nodeSchemas.select,
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
    
    // 如果是文件类型且没有提供 storageKey，自动生成并上传空内容
    let storageKey = input.storageKey;
    let bucket = input.bucket || DEFAULT_BUCKET;
    
    if (input.type === NODE_TYPES.FILE && !storageKey) {
      storageKey = generateStorageKey(context.currentUserId, input.parentId || null, input.name);
      const mimeType = input.mimeType || 'text/plain';
      // 上传空内容作为初始文件
      await uploadFile(storageKey, Buffer.from(''), mimeType, bucket);
    }
    
    // 确保 description 是字符串
    let description = input.description;
    if (description && typeof description === 'object') {
      description = JSON.stringify(description);
    }
    
    const [result] = await db.insert(node).values({
      type: input.type,
      parentId: input.parentId || null,
      name: input.name,
      path,
      materializedPath,
      description,
      icon: input.icon,
      color: input.color,
      originalName: input.type === NODE_TYPES.FILE ? input.name : null,
      extension: input.extension,
      mimeType: input.mimeType,
      size: input.size ?? 0,
      storageKey,
      bucket: input.type === NODE_TYPES.FILE ? bucket : undefined,
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
