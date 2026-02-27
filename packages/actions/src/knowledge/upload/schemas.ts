/**
 * 知识库上传 Schemas (TypeBox)
 */

import { t } from 'elysia';

export const uploadGetUrlBodySchema = t.Object({
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父文件夹 ID，null 表示根目录' })),
  filename: t.String({ minLength: 1, maxLength: 255, description: '文件名' }),
  mimeType: t.String({ description: '文件 MIME 类型' }),
});

export const uploadConfirmBodySchema = t.Object({
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父文件夹 ID，null 表示根目录' })),
  name: t.String({ minLength: 1, maxLength: 255, description: '文件名' }),
  storageKey: t.String({ description: '存储键' }),
  mimeType: t.String({ description: '文件 MIME 类型' }),
  size: t.Number({ description: '文件大小（字节）' }),
  description: t.Optional(t.String({ description: '文件描述' })),
});

export const uploadDirectBodySchema = t.Object({
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父文件夹 ID，null 表示根目录' })),
  name: t.String({ minLength: 1, maxLength: 255, description: '文件名' }),
  content: t.String({ maxLength: 100000, description: '文件内容（纯文本，建议不超过50000字符）' }),
  mimeType: t.Optional(t.String({ description: '文件 MIME 类型，默认 text/plain' })),
  description: t.Optional(t.String({ description: '文件描述' })),
});

export const uploadForceBodySchema = t.Object({
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父文件夹 ID，null 表示根目录' })),
  name: t.String({ minLength: 1, maxLength: 255, description: '文件名' }),
  content: t.String({ description: '文件内容（Base64 编码）' }),
  mimeType: t.Optional(t.String({ description: '文件 MIME 类型' })),
  description: t.Optional(t.String({ description: '文件描述' })),
  conflictMode: t.Union([t.Literal('overwrite'), t.Literal('newVersion'), t.Literal('copy')], { description: '冲突处理模式：overwrite=覆盖，newVersion=新版本，copy=复制' }),
  existingNodeId: t.Optional(t.String({ description: '已存在的节点 ID（用于覆盖或新版本）' })),
});
