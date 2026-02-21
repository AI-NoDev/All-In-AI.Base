/**
 * 保存文本内容 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeZodSchemas, NODE_TYPES, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';
import { uploadFile } from '../../files/s3Client';
import { contentParamsSchema, saveTextBodySchema } from './schemas';

export const contentSaveText = defineAction({
  meta: {
    name: 'knowledge.content.saveText',
    displayName: '保存文本内容',
    description: `保存文本文件内容（在线编辑保存）。

**路径参数：**
- id: 文件节点UUID

**请求体参数：**
- content: 文件内容，必填，UTF-8字符串

**权限检查：**
- 需要对该节点有 write 权限

**返回：**
- 更新后的节点完整信息（包含新的 size）

**使用场景：**
- 在线文本编辑器保存
- Markdown 编辑保存

**示例：**
\`\`\`json
{
  "content": "# 标题\\n\\n这是更新后的内容"
}
\`\`\``,
    tags: ['knowledge', 'content'],
    method: 'PUT',
    path: '/api/knowledge/nodes/:id/text',
  },
  schemas: {
    paramsSchema: contentParamsSchema,
    bodySchema: saveTextBodySchema,
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FILE)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'write');

    if (!nodeRecord.storageKey || !nodeRecord.bucket) {
      throw ActionError.badRequest('error.knowledge.noStorageKey');
    }

    const buffer = Buffer.from(input.content, 'utf-8');
    
    await uploadFile(nodeRecord.storageKey, buffer, nodeRecord.mimeType || 'text/plain', nodeRecord.bucket);

    const [result] = await db.update(node)
      .set({
        size: buffer.length,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(node.id, input.id))
      .returning();

    return result as NodeSelect;
  },
});
