/**
 * AI 聊天附件上传
 * 上传文件到 MinIO，返回可访问的 URL
 */

import { z } from 'zod';
import { defineAction } from '../core/define';
import { uploadFile, getPresignedDownloadUrl, DEFAULT_BUCKET } from './s3Client';

// AI 聊天专用 bucket
const AI_CHAT_BUCKET = process.env.S3_AI_CHAT_BUCKET || DEFAULT_BUCKET;

// ============ 上传 AI 聊天附件 ============
export const aiChatUploadAttachment = defineAction({
  meta: {
    ignoreTools: true,
    name: 'files.aiChatUpload',
    displayName: '上传AI聊天附件',
    description: `上传文件到AI聊天存储，返回可访问的预签名URL（7天有效）。

**请求体参数：**
- filename: 文件名，必填，1-255字符
- content: 文件内容，必填，Base64编码
- mimeType: MIME类型，必填，如 "image/png", "application/pdf"

**返回：**
- url: 预签名下载URL（7天有效）
- storageKey: 存储路径，用于后续获取URL
- mimeType: 文件MIME类型
- size: 文件大小（字节）

**使用场景：**
- AI对话中上传图片、文档等附件
- 支持多模态AI模型的文件输入

**示例：**
\`\`\`json
{
  "filename": "screenshot.png",
  "content": "iVBORw0KGgoAAAANSUhEUgAA...",
  "mimeType": "image/png"
}
\`\`\``,
    tags: ['files', 'ai-chat'],
    method: 'POST',
    path: '/api/files/ai-chat/upload',
  },
  schemas: {
    bodySchema: z.object({
      filename: z.string().min(1).max(255),
      content: z.string(), // base64 编码的文件内容
      mimeType: z.string(),
    }),
    outputSchema: z.object({
      url: z.string(),
      storageKey: z.string(),
      mimeType: z.string(),
      size: z.number(),
    }),
  },
  execute: async (input, context) => {
    const buffer = Buffer.from(input.content, 'base64');
    
    // 生成存储 key（使用 ai-chat 子目录）
    const storageKey = `ai-chat/${context.currentUserId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${input.filename}`;
    
    // 上传到 MinIO
    await uploadFile(storageKey, buffer, input.mimeType, AI_CHAT_BUCKET);
    
    // 生成长期有效的预签名 URL（7天）
    const { url } = await getPresignedDownloadUrl(storageKey, AI_CHAT_BUCKET, 7 * 24 * 3600);
    
    return {
      url,
      storageKey,
      mimeType: input.mimeType,
      size: buffer.length,
    };
  },
});

// ============ 获取 AI 聊天附件 URL ============
export const aiChatGetAttachmentUrl = defineAction({
  meta: {
    name: 'files.aiChatGetUrl',
    displayName: '获取AI聊天附件URL',
    description: `获取已上传AI聊天附件的新预签名URL（7天有效）。

**请求体参数：**
- storageKey: 存储路径，必填，上传时返回的storageKey

**返回：**
- url: 新的预签名下载URL
- expiresAt: URL过期时间（ISO 8601格式）

**使用场景：**
- 原URL过期后重新获取访问链接
- 历史对话中的附件重新加载

**示例：**
\`\`\`json
{
  "storageKey": "ai-chat/user-id/1234567890-abc123-image.png"
}
\`\`\``,
    tags: ['files', 'ai-chat'],
    method: 'POST',
    path: '/api/files/ai-chat/get-url',
  },
  schemas: {
    bodySchema: z.object({
      storageKey: z.string(),
    }),
    outputSchema: z.object({
      url: z.string(),
      expiresAt: z.string(),
    }),
  },
  execute: async (input) => {
    // 生成 7 天有效的预签名 URL
    const { url, expiresAt } = await getPresignedDownloadUrl(input.storageKey, AI_CHAT_BUCKET, 7 * 24 * 3600);
    
    return {
      url,
      expiresAt: expiresAt.toISOString(),
    };
  },
});

export const aiChatUploadActions = [
  aiChatUploadAttachment,
  aiChatGetAttachmentUrl,
];
