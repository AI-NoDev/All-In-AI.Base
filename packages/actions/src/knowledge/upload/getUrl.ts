/**
 * 获取上传URL
 */

import { t } from 'elysia';
import { defineAction } from '../../core/define';
import { getPresignedUploadUrl, generateStorageKey } from '../../files/s3Client';
import { uploadGetUrlBodySchema } from './schemas';

export const uploadGetUrl = defineAction({
  meta: {
    name: 'knowledge.upload.getUrl',
    displayName: '获取上传URL',
    description: `获取预签名上传URL，用于大文件分片上传。

**请求体参数：**
- parentId: 父文件夹ID，可选，null表示根目录
- filename: 文件名，必填，1-255字符
- mimeType: MIME类型，必填

**返回：**
- uploadUrl: 预签名上传URL（直接PUT到此URL）
- storageKey: 存储路径，用于后续确认上传
- expiresAt: URL过期时间（ISO 8601）

**使用场景：**
- 大文件上传（>5MB）
- 前端直传S3/MinIO

**示例：**
\`\`\`json
{
  "parentId": "folder-uuid",
  "filename": "large-file.zip",
  "mimeType": "application/zip"
}
\`\`\``,
    tags: ['knowledge', 'upload'],
    method: 'POST',
    path: '/api/knowledge/upload/url',
  },
  schemas: {
    bodySchema: uploadGetUrlBodySchema,
    outputSchema: t.Object({
      uploadUrl: t.String(),
      storageKey: t.String(),
      expiresAt: t.String(),
    }),
  },
  execute: async (input, context) => {
    const storageKey = generateStorageKey(context.currentUserId, input.parentId || null, input.filename);
    const { url, expiresAt } = await getPresignedUploadUrl(storageKey, input.mimeType);

    return {
      uploadUrl: url,
      storageKey,
      expiresAt: expiresAt.toISOString(),
    };
  },
});
