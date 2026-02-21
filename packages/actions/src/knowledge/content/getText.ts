/**
 * 获取文本内容 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, NODE_TYPES } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission, isTextFile } from '../utils';
import { getFileAsString } from '../../files/s3Client';
import { contentParamsSchema, textContentOutputSchema } from './schemas';

export const contentGetText = defineAction({
  meta: {
    name: 'knowledge.content.getText',
    displayName: '获取文本内容',
    description: `获取文本文件内容（用于在线编辑）。

**路径参数：**
- id: 文件节点UUID

**权限检查：**
- 需要对该节点有 read 权限

**限制：**
- 仅支持文本类型文件（.txt, .md, .json, .js, .ts 等）

**返回：**
- id: 节点ID
- name: 文件名
- content: 文件内容（UTF-8字符串）
- mimeType: MIME类型
- extension: 扩展名
- parentId: 父节点ID

**使用场景：**
- 在线文本编辑器
- Markdown 预览

**示例：**
GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/text`,
    tags: ['knowledge', 'content'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/text',
  },
  schemas: {
    paramsSchema: contentParamsSchema,
    outputSchema: textContentOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FILE)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'read');

    if (!isTextFile(nodeRecord.extension, nodeRecord.mimeType)) {
      throw ActionError.badRequest('error.knowledge.notTextFile');
    }

    if (!nodeRecord.storageKey || !nodeRecord.bucket) {
      throw ActionError.badRequest('error.knowledge.noStorageKey');
    }

    const content = await getFileAsString(nodeRecord.storageKey, nodeRecord.bucket);

    return {
      id: nodeRecord.id,
      name: nodeRecord.name,
      content,
      mimeType: nodeRecord.mimeType,
      extension: nodeRecord.extension,
      parentId: nodeRecord.parentId,
    };
  },
});
