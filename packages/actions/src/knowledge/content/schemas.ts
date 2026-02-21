/**
 * 知识库文件内容 Schemas
 */

import { z } from 'zod';
import { nodeZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 参数 Schemas ============
export const contentParamsSchema = z.object({
  id: z.string().describe('文件节点 ID'),
});

// ============ 输出 Schemas ============
export const downloadUrlOutputSchema = z.object({
  url: z.string().describe('下载 URL'),
  expiresAt: z.string().describe('URL 过期时间'),
});

export const textContentOutputSchema = z.object({
  id: z.string().describe('文件节点 ID'),
  name: z.string().describe('文件名'),
  content: z.string().describe('文件文本内容'),
  mimeType: z.string().nullable().describe('MIME 类型'),
  extension: z.string().nullable().describe('文件扩展名'),
  parentId: z.string().nullable().describe('父文件夹 ID'),
});

export const rawContentOutputSchema = z.object({
  content: z.string().describe('原始内容（Base64 编码）'),
  mimeType: z.string().nullable().describe('MIME 类型'),
});

// ============ 请求体 Schemas ============
export const saveTextBodySchema = z.object({
  content: z.string().describe('要保存的文本内容'),
});

// ============ 导出节点 Schema ============
export { nodeZodSchemas };
