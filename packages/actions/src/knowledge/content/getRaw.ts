/**
 * 获取原始内容 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, NODE_TYPES } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';
import { getFileAsString } from '../../files/s3Client';
import { contentParamsSchema, rawContentOutputSchema } from './schemas';

export const contentGetRaw = defineAction({
  meta: {
    name: 'knowledge.content.getRaw',
    displayName: '获取原始内容',
    description: `获取文件原始内容（不验证文件类型）。

**路径参数：**
- id: 文件节点UUID

**权限检查：**
- 需要对该节点有 read 权限

**返回：**
- content: 文件内容（字符串）
- mimeType: MIME类型

**使用场景：**
- 获取任意文件的原始内容
- 文件预览

**示例：**
GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/content`,
    tags: ['knowledge', 'content'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/content',
  },
  schemas: {
    paramsSchema: contentParamsSchema,
    outputSchema: rawContentOutputSchema,
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

    if (!nodeRecord.storageKey || !nodeRecord.bucket) {
      throw ActionError.badRequest('error.knowledge.noStorageKey');
    }

    const content = await getFileAsString(nodeRecord.storageKey, nodeRecord.bucket);

    return {
      content,
      mimeType: nodeRecord.mimeType,
    };
  },
});
