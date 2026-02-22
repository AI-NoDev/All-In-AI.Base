/**
 * 下载历史版本 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeVersion } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';
import { getPresignedDownloadUrl } from '../../files/s3Client';
import { versionIdParamsSchema, downloadUrlOutputSchema } from './schemas';

export const versionDownload = defineAction({
  meta: {
    ignoreTools: true,
    name: 'knowledge.version.download',
    displayName: '下载历史版本',
    description: `获取历史版本的预签名下载URL（1小时有效）。

**路径参数：**
- id: 版本记录UUID

**权限检查：**
- 需要对关联的文件节点有 read 权限

**返回：**
- url: 预签名下载URL
- expiresAt: URL过期时间（ISO 8601）

**文件名格式：**
- 自动添加版本号后缀，如 "document_v2.pdf"

**示例：**
GET /api/knowledge/versions/version-uuid/download-url`,
    tags: ['knowledge', 'version'],
    method: 'GET',
    path: '/api/knowledge/versions/:id/download-url',
  },
  schemas: {
    paramsSchema: versionIdParamsSchema,
    outputSchema: downloadUrlOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [versionRecord] = await db.select().from(nodeVersion)
      .where(eq(nodeVersion.id, input.id))
      .limit(1);

    if (!versionRecord) {
      throw ActionError.notFound('error.knowledge.versionNotFound');
    }

    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, versionRecord.nodeId), isNull(node.deletedAt)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'read');

    const baseName = (nodeRecord.originalName || nodeRecord.name).replace(/\.[^.]+$/, '');
    const ext = nodeRecord.extension ? `.${nodeRecord.extension}` : '';
    const downloadName = `${baseName}_${versionRecord.versionNumber}${ext}`;

    const { url, expiresAt } = await getPresignedDownloadUrl(
      versionRecord.storageKey,
      versionRecord.bucket,
      3600,
      downloadName
    );

    return { url, expiresAt: expiresAt.toISOString() };
  },
});
