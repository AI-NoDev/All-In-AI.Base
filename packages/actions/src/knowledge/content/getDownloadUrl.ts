/**
 * 获取下载URL Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, NODE_TYPES } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';
import { getPresignedDownloadUrl } from '../../files/s3Client';
import { contentParamsSchema, downloadUrlOutputSchema } from './schemas';

export const contentGetDownloadUrl = defineAction({
  meta: {
    name: 'knowledge.content.getDownloadUrl',
    displayName: '获取下载URL',
    description: `获取文件预签名下载URL（1小时有效）。

**路径参数：**
- id: 文件节点UUID

**权限检查：**
- 需要对该节点有 read 权限

**返回：**
- url: 预签名下载URL
- expiresAt: URL过期时间（ISO 8601）

**副作用：**
- 自动增加文件下载次数计数

**示例：**
GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/download-url`,
    tags: ['knowledge', 'content'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/download-url',
  },
  schemas: {
    paramsSchema: contentParamsSchema,
    outputSchema: downloadUrlOutputSchema,
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

    const { url, expiresAt } = await getPresignedDownloadUrl(
      nodeRecord.storageKey,
      nodeRecord.bucket,
      3600,
      nodeRecord.originalName || nodeRecord.name
    );

    // 更新下载次数
    await db.update(node)
      .set({ downloadCount: (nodeRecord.downloadCount || 0) + 1 })
      .where(eq(node.id, input.id));

    return {
      url,
      expiresAt: expiresAt.toISOString(),
    };
  },
});
