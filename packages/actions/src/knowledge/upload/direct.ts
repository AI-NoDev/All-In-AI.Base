/**
 * 直接上传（小文件）
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, nodeSchemas, NODE_TYPES, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, parseFileName } from '../utils';
import { uploadFile, generateStorageKey } from '../../files/s3Client';
import { uploadDirectBodySchema } from './schemas';

export const uploadDirect = defineAction({
  meta: {
    name: 'knowledge.upload.direct',
    displayName: '直接上传',
    description: `直接上传文件并创建节点，支持纯文本内容。

**重要限制：**
- content 内容长度建议不超过 50000 字符
- 超长内容可能导致 JSON 解析失败
- 对于大文件，建议分多次调用或精简内容

**请求体参数：**
- parentId: 父文件夹ID，可选，null表示根目录
- name: 文件名，必填，1-255字符
- content: 文件内容，必填，纯文本（建议<50000字符）
- mimeType: MIME类型，可选，默认 text/plain
- description: 描述，可选

**返回：**
- success: 是否成功
- node: 创建的节点（成功时）
- conflict: 冲突信息（存在同名文件时）

**示例：**
\`\`\`json
{
  "parentId": "folder-uuid",
  "name": "readme.md",
  "content": "# Hello\\n\\n内容",
  "mimeType": "text/markdown"
}
\`\`\``,
    tags: ['knowledge', 'upload'],
    method: 'POST',
    path: '/api/knowledge/upload/direct',
  },
  schemas: {
    bodySchema: uploadDirectBodySchema,
    outputSchema: t.Object({
      success: t.Boolean(),
      node: t.Optional(nodeSchemas.select),
      conflict: t.Optional(t.Object({
        nodeId: t.String(),
        name: t.String(),
        size: t.Number(),
        updatedAt: t.String(),
      })),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const parentId = input.parentId || null;
    const { extension } = parseFileName(input.name);
    
    const parentCondition = parentId === null 
      ? isNull(node.parentId) 
      : eq(node.parentId, parentId);
    
    const [existingNode] = await db.select().from(node)
      .where(and(
        parentCondition, 
        eq(node.name, input.name), 
        eq(node.type, NODE_TYPES.FILE),
        isNull(node.deletedAt)
      ))
      .limit(1);
    
    if (existingNode) {
      return {
        success: false,
        conflict: {
          nodeId: existingNode.id,
          name: existingNode.name,
          size: existingNode.size,
          updatedAt: existingNode.updatedAt,
        },
      };
    }
    
    let path = '/';
    let materializedPath = '';
    
    if (parentId) {
      const [parent] = await db.select().from(node)
        .where(and(eq(node.id, parentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER)))
        .limit(1);
      
      if (parent) {
        path = buildPath(parent.path, parent.name);
        materializedPath = buildMaterializedPath(parent.materializedPath, parent.id);
      }
    }
    
    const buffer = Buffer.from(input.content, 'utf-8');
    const mimeType = input.mimeType || 'application/octet-stream';
    const storageKey = generateStorageKey(context.currentUserId, parentId, input.name);

    const uploadResult = await uploadFile(storageKey, buffer, mimeType);

    // 确保 description 是字符串
    let description = input.description;
    if (description && typeof description === 'object') {
      description = JSON.stringify(description);
    }

    const [result] = await db.insert(node).values({
      type: NODE_TYPES.FILE,
      parentId,
      name: input.name,
      path,
      materializedPath,
      originalName: input.name,
      extension,
      mimeType,
      size: buffer.length,
      storageKey,
      bucket: uploadResult.bucket,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
      description,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as NodeInsert).returning();

    return { success: true, node: result as NodeSelect };
  },
});
