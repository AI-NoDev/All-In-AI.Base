/**
 * 知识库上传 Schemas
 */

import { z } from 'zod';

export const uploadGetUrlBodySchema = z.object({
  parentId: z.string().nullable().optional().describe('父文件夹 ID，null 表示根目录'),
  filename: z.string().min(1).max(255).describe('文件名'),
  mimeType: z.string().describe('文件 MIME 类型'),
});

export const uploadConfirmBodySchema = z.object({
  parentId: z.string().nullable().optional().describe('父文件夹 ID，null 表示根目录'),
  name: z.string().min(1).max(255).describe('文件名'),
  storageKey: z.string().describe('存储键'),
  mimeType: z.string().describe('文件 MIME 类型'),
  size: z.number().describe('文件大小（字节）'),
  description: z.string().optional().describe('文件描述'),
});

export const uploadDirectBodySchema = z.object({
  parentId: z.string().nullable().optional().describe('父文件夹 ID，null 表示根目录'),
  name: z.string().min(1).max(255).describe('文件名'),
  content: z.string().describe('文件内容（Base64 编码）'),
  mimeType: z.string().optional().describe('文件 MIME 类型'),
  description: z.string().optional().describe('文件描述'),
});

export const uploadForceBodySchema = z.object({
  parentId: z.string().nullable().optional().describe('父文件夹 ID，null 表示根目录'),
  name: z.string().min(1).max(255).describe('文件名'),
  content: z.string().describe('文件内容（Base64 编码）'),
  mimeType: z.string().optional().describe('文件 MIME 类型'),
  description: z.string().optional().describe('文件描述'),
  conflictMode: z.enum(['overwrite', 'newVersion', 'copy']).describe('冲突处理模式：overwrite=覆盖，newVersion=新版本，copy=复制'),
  existingNodeId: z.string().optional().describe('已存在的节点 ID（用于覆盖或新版本）'),
});
