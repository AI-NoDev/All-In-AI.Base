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
    ignoreTools: true,
    name: 'knowledge.upload.direct',
    displayName: '直接上传',
    description: `直接上传小文件（Base64编码），自动检测同名冲突。

**请求体参数：**
- parentId: 父文件夹ID，可选，null表示根目录
- name: 文件名，必填，1-255字符
- content: 文件内容，必填，Base64编码
- mimeType: MIME类型，可选，默认 application/octet-stream
- description: 描述，可选

**返回：**
- success: 是否成功
- node: 创建的节点（成功时）
- conflict: 冲突信息（存在同名文件时）
  - nodeId: 已存在节点ID
  - name: 文件名
  - size: 文件大小
  - updatedAt: 更新时间

**使用场景：**
- 小文件快速上传（<5MB）
- 文本文件创建

**示例：**
\`\`\`json
{
  "parentId": null,
  "name": "readme.md",
  "content": "IyBIZWxsbyBXb3JsZA==",
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
    
    const buffer = Buffer.from(input.content, 'base64');
    const mimeType = input.mimeType || 'application/octet-stream';
    const storageKey = generateStorageKey(context.currentUserId, parentId, input.name);

    const uploadResult = await uploadFile(storageKey, buffer, mimeType);

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
      description: input.description,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as NodeInsert).returning();

    return { success: true, node: result as NodeSelect };
  },
});
