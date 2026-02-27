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
    description: `获取预签名上传URL，用于文件上传。

**这是创建文件的第一步！**
创建文件的完整流程：
1. 调用此接口获取 uploadUrl 和 storageKey
2. 使用 uploadUrl 上传文件内容（HTTP PUT 请求，Body 为文件内容）
3. 调用 knowledge.node.create 创建文件节点，传入 storageKey

**请求体参数：**
- parentId: 父文件夹ID，可选，null表示根目录
- filename: 文件名，必填，1-255字符
- mimeType: MIME类型，必填（如 text/markdown, text/plain, application/json）

**返回：**
- uploadUrl: 预签名上传URL（使用 HTTP PUT 方法上传文件内容到此URL）
- storageKey: 存储路径，创建文件节点时必须传入此值
- expiresAt: URL过期时间（ISO 8601）

**示例：**
\`\`\`json
{
  "parentId": "folder-uuid",
  "filename": "readme.md",
  "mimeType": "text/markdown"
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
