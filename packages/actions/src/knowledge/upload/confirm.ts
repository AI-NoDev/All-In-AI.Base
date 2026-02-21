/**
 * 确认上传完成
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeZodSchemas, NODE_TYPES, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, assertNodePermission, parseFileName } from '../utils';
import { DEFAULT_BUCKET } from '../../files/s3Client';
import { uploadConfirmBodySchema } from './schemas';

export const uploadConfirm = defineAction({
  meta: {
    name: 'knowledge.upload.confirm',
    displayName: '确认上传',
    description: `确认文件上传完成并创建节点记录。

**请求体参数：**
- parentId: 父文件夹ID，可选
- name: 文件名，必填，1-255字符
- storageKey: 存储路径，必填（从 getUrl 返回）
- mimeType: MIME类型，必填
- size: 文件大小（字节），必填
- description: 描述，可选

**权限检查：**
- 如果指定 parentId，需要对父节点有 write 权限

**返回：**
- 创建的文件节点完整信息

**使用场景：**
- 大文件上传完成后调用
- 配合 getUrl 使用

**示例：**
\`\`\`json
{
  "parentId": "folder-uuid",
  "name": "document.pdf",
  "storageKey": "knowledge/user-id/xxx/document.pdf",
  "mimeType": "application/pdf",
  "size": 1048576
}
\`\`\``,
    tags: ['knowledge', 'upload'],
    method: 'POST',
    path: '/api/knowledge/upload/confirm',
  },
  schemas: {
    bodySchema: uploadConfirmBodySchema,
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { extension } = parseFileName(input.name);
    
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
      type: NODE_TYPES.FILE,
      parentId: input.parentId || null,
      name: input.name,
      path,
      materializedPath,
      originalName: input.name,
      extension,
      mimeType: input.mimeType,
      size: input.size,
      storageKey: input.storageKey,
      bucket: DEFAULT_BUCKET,
      description: input.description,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as NodeInsert).returning();

    return result as NodeSelect;
  },
});
