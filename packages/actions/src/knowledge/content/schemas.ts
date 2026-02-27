/**
 * 知识库文件内容 Schemas (TypeBox)
 */

import { t } from 'elysia';
import { nodeSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 参数 Schemas ============
export const contentParamsSchema = t.Object({
  id: t.String({ description: '文件节点 ID' }),
});

// ============ 输出 Schemas ============
export const downloadUrlOutputSchema = t.Object({
  url: t.String({ description: '下载 URL' }),
  expiresAt: t.String({ description: 'URL 过期时间' }),
});

export const textContentOutputSchema = t.Object({
  id: t.String({ description: '文件节点 ID' }),
  name: t.String({ description: '文件名' }),
  content: t.String({ description: '文件文本内容' }),
  mimeType: t.Union([t.String(), t.Null()], { description: 'MIME 类型' }),
  extension: t.Union([t.String(), t.Null()], { description: '文件扩展名' }),
  parentId: t.Union([t.String(), t.Null()], { description: '父文件夹 ID' }),
});

export const rawContentOutputSchema = t.Object({
  content: t.String({ description: '原始内容（Base64 编码）' }),
  mimeType: t.Union([t.String(), t.Null()], { description: 'MIME 类型' }),
});



// ============ 导出节点 Schema ============
export { nodeSchemas };
