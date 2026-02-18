/**
 * AI 聊天附件上传
 * 上传文件到 MinIO，返回可访问的 URL
 */

import { z } from 'zod';
import { defineAction } from '../core/define';
import { uploadFile, generateStorageKey, getPresignedDownloadUrl, DEFAULT_BUCKET } from './s3Client';

// AI 聊天专用 bucket
const AI_CHAT_BUCKET = process.env.S3_AI_CHAT_BUCKET || DEFAULT_BUCKET;

// ============ 上传 AI 聊天附件 ============
export const aiChatUploadAttachment = defineAction({
  meta: {
    name: 'files.aiChatUpload',
    displayName: '上传AI聊天附件',
    description: '上传文件到存储，返回可访问的URL',
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
    description: '获取已上传附件的访问URL',
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
