/**
 * 强制上传（处理冲突）
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeVersion, nodeZodSchemas, NODE_TYPES, type NodeSelect, type NodeInsert, type NodeVersionInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, assertNodePermission, parseFileName, generateUniqueName } from '../utils';
import { uploadFile, generateStorageKey, DEFAULT_BUCKET } from '../../files/s3Client';
import { uploadForceBodySchema } from './schemas';

export const uploadForce = defineAction({
  meta: {
    ignoreTools: true,
    name: 'knowledge.upload.force',
    displayName: '强制上传',
    description: `上传文件并处理同名冲突，支持覆盖、新版本、副本三种模式。

**请求体参数：**
- parentId: 父文件夹ID，可选
- name: 文件名，必填，1-255字符
- content: 文件内容，必填，Base64编码
- mimeType: MIME类型，可选
- description: 描述，可选
- conflictMode: 冲突处理模式，必填
  - "overwrite": 覆盖现有文件
  - "newVersion": 保存为新版本（保留历史）
  - "copy": 创建副本（自动重命名）
- existingNodeId: 现有节点ID（overwrite/newVersion模式必填）

**权限检查：**
- overwrite/newVersion: 需要对现有节点有 write 权限
- copy: 需要对父节点有 write 权限

**返回：**
- 创建/更新的节点完整信息

**示例（覆盖）：**
\`\`\`json
{
  "name": "report.xlsx",
  "content": "...",
  "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "conflictMode": "overwrite",
  "existingNodeId": "existing-file-uuid"
}
\`\`\``,
    tags: ['knowledge', 'upload'],
    method: 'POST',
    path: '/api/knowledge/upload/force',
  },
  schemas: {
    bodySchema: uploadForceBodySchema,
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const parentId = input.parentId || null;
    const buffer = Buffer.from(input.content, 'base64');
    const { baseName, extension } = parseFileName(input.name);
    const mimeType = input.mimeType || 'application/octet-stream';
    
    if (input.conflictMode === 'overwrite') {
      if (!input.existingNodeId) {
        throw ActionError.badRequest('error.knowledge.existingNodeIdRequired');
      }
      
      const [existingNode] = await db.select().from(node)
        .where(and(eq(node.id, input.existingNodeId), isNull(node.deletedAt)))
        .limit(1);
      
      if (!existingNode) {
        throw ActionError.notFound('error.knowledge.nodeNotFound');
      }

      await assertNodePermission(db, context.currentUserId, existingNode, 'write');
      
      const storageKey = generateStorageKey(context.currentUserId, existingNode.parentId, input.name);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.update(node)
        .set({
          storageKey,
          bucket: uploadResult.bucket,
          etag: uploadResult.etag,
          versionId: uploadResult.versionId,
          size: buffer.length,
          mimeType,
          name: input.name,
          extension,
          updatedBy: context.currentUserName,
          updatedById: context.currentUserId,
        })
        .where(eq(node.id, input.existingNodeId))
        .returning();
      
      return result as NodeSelect;
      
    } else if (input.conflictMode === 'newVersion') {
      if (!input.existingNodeId) {
        throw ActionError.badRequest('error.knowledge.existingNodeIdRequired');
      }
      
      const [existingNode] = await db.select().from(node)
        .where(and(eq(node.id, input.existingNodeId), isNull(node.deletedAt)))
        .limit(1);
      
      if (!existingNode) {
        throw ActionError.notFound('error.knowledge.nodeNotFound');
      }

      await assertNodePermission(db, context.currentUserId, existingNode, 'write');
      
      const existingVersions = await db.select({ versionNumber: nodeVersion.versionNumber })
        .from(nodeVersion)
        .where(eq(nodeVersion.nodeId, input.existingNodeId));
      
      let maxVersion = 0;
      for (const v of existingVersions) {
        const num = parseInt(v.versionNumber.replace('v', ''), 10);
        if (!isNaN(num) && num > maxVersion) maxVersion = num;
      }
      
      if (existingNode.storageKey) {
        await db.insert(nodeVersion).values({
          nodeId: existingNode.id,
          versionNumber: maxVersion === 0 ? 'v1' : `v${maxVersion}`,
          storageKey: existingNode.storageKey,
          bucket: existingNode.bucket || DEFAULT_BUCKET,
          s3VersionId: existingNode.versionId,
          etag: existingNode.etag,
          size: existingNode.size,
          createdById: context.currentUserId,
          createdBy: context.currentUserName,
        } as NodeVersionInsert);
      }
      
      const storageKey = generateStorageKey(context.currentUserId, parentId, input.name);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.update(node)
        .set({
          storageKey,
          bucket: uploadResult.bucket,
          etag: uploadResult.etag,
          versionId: uploadResult.versionId,
          size: buffer.length,
          mimeType,
          versionCount: (existingNode.versionCount || 0) + 1,
          updatedBy: context.currentUserName,
          updatedById: context.currentUserId,
        })
        .where(eq(node.id, input.existingNodeId))
        .returning();
      
      return result as NodeSelect;
      
    } else {
      // copy mode
      const parentCondition = parentId === null 
        ? isNull(node.parentId) 
        : eq(node.parentId, parentId);
      
      const existingNodes = await db.select({ name: node.name })
        .from(node)
        .where(and(parentCondition, isNull(node.deletedAt)));
      
      const existingNames = new Set(existingNodes.map(n => n.name));
      const newName = generateUniqueName(baseName, extension, existingNames);
      
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
      
      const storageKey = generateStorageKey(context.currentUserId, parentId, newName);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.insert(node).values({
        type: NODE_TYPES.FILE,
        parentId,
        name: newName,
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
      
      return result as NodeSelect;
    }
  },
});
