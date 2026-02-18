/**
 * 公开文件上传 Actions
 * 用于上传公开访问的文件（如头像），不需要签名URL
 */

import { z } from 'zod';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import { uploadFile, s3Client, DEFAULT_BUCKET } from './s3Client';
import { PutBucketPolicyCommand, GetBucketPolicyCommand } from '@aws-sdk/client-s3';

// 公开 bucket 名称
export const PUBLIC_BUCKET = process.env.S3_PUBLIC_BUCKET || 'public';

// 允许的图片 MIME 类型
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

// 最大文件大小 (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

/**
 * 生成公开文件的存储路径
 * @param category 分类目录 (如 agent-avatar, user-avatar)
 * @param filename 文件名
 */
function generatePublicStorageKey(category: string, filename: string): string {
  const uuid = crypto.randomUUID();
  const ext = filename.split('.').pop()?.toLowerCase() || 'png';
  return `${category}/${uuid}.${ext}`;
}

/**
 * 获取公开文件的访问 URL
 */
function getPublicUrl(key: string): string {
  const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
  return `${endpoint}/${PUBLIC_BUCKET}/${key}`;
}

// ============ 上传公开头像 ============
export const publicUploadAvatar = defineAction({
  meta: {
    name: 'public.uploadAvatar',
    displayName: '上传公开头像',
    description: '上传头像到公开存储，返回可直接访问的URL',
    tags: ['public', 'upload', 'avatar'],
    method: 'POST',
    path: '/api/public/upload/avatar',
  },
  schemas: {
    bodySchema: z.object({
      category: z.enum(['agent-avatar', 'user-avatar', 'group-avatar']),
      filename: z.string().min(1).max(255),
      content: z.string(), // base64 encoded
      mimeType: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      url: z.string(),
      key: z.string(),
    }),
  },
  execute: async (input, context) => {
    // 验证 MIME 类型
    if (!ALLOWED_IMAGE_TYPES.includes(input.mimeType)) {
      throw ActionError.badRequest('error.upload.invalidImageType');
    }

    // 解码 base64 内容
    const buffer = Buffer.from(input.content, 'base64');

    // 验证文件大小
    if (buffer.length > MAX_FILE_SIZE) {
      throw ActionError.badRequest('error.upload.fileTooLarge');
    }

    // 生成存储路径
    const storageKey = generatePublicStorageKey(input.category, input.filename);

    // 上传到公开 bucket
    await uploadFile(storageKey, buffer, input.mimeType, PUBLIC_BUCKET);

    // 返回公开访问 URL
    const url = getPublicUrl(storageKey);

    return {
      success: true,
      url,
      key: storageKey,
    };
  },
});

export const publicUploadActions = [
  publicUploadAvatar,
];
