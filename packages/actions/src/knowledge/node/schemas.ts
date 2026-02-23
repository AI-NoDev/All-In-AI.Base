/**
 * 知识库节点 Schemas (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { nodeSchemas, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge/node';

// ============ Filter Schema ============
export const nodeFilterSchema = t.Optional(t.Object({
  // IN 查询
  ids: t.Optional(t.Array(t.String({ description: '节点 ID' }), { description: '节点 ID 列表，批量查询' })),
  types: t.Optional(t.Array(t.Union([t.Literal('folder'), t.Literal('file')]), { description: '节点类型列表' })),
  // 精确匹配
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父文件夹 ID，null 表示根目录' })),
  type: t.Optional(t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型：folder=文件夹，file=文件' })),
  // 模糊匹配
  name: t.Optional(t.String({ description: '名称（模糊匹配）' })),
  extension: t.Optional(t.String({ description: '文件扩展名' })),
  // 时间范围
  createdAtStart: t.Optional(t.String({ description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间结束' })),
  // 其他
  isPublic: t.Optional(t.Boolean({ description: '是否公开' })),
}, { description: '过滤条件' }));

export const nodeSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('name'), t.Literal('type'), t.Literal('size'),
    t.Literal('orderNum'), t.Literal('createdAt'), t.Literal('updatedAt')
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

export const nodePaginationBodySchema = t.Object({
  filter: nodeFilterSchema,
  sort: nodeSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});


export const nodeCreateBodySchema = t.Object({
  type: t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型：folder=文件夹，file=文件' }),
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父文件夹 ID，null 表示根目录' })),
  name: t.String({ minLength: 1, maxLength: 255, description: '节点名称' }),
  description: t.Optional(t.String({ description: '描述' })),
  // 文件夹特有
  icon: t.Optional(t.String({ description: '图标（文件夹）' })),
  color: t.Optional(t.String({ description: '颜色（文件夹）' })),
  // 文件特有
  extension: t.Optional(t.String({ description: '文件扩展名' })),
  mimeType: t.Optional(t.String({ description: 'MIME 类型' })),
  size: t.Optional(t.Number({ description: '文件大小（字节）' })),
  storageKey: t.Optional(t.String({ description: '存储键' })),
  bucket: t.Optional(t.String({ description: '存储桶' })),
  etag: t.Optional(t.String({ description: 'ETag' })),
  versionId: t.Optional(t.String({ description: '版本 ID' })),
});

export const nodeUpdateBodySchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 255, description: '节点名称' })),
  description: t.Optional(t.Union([t.String(), t.Null()], { description: '描述' })),
  icon: t.Optional(t.Union([t.String(), t.Null()], { description: '图标（文件夹）' })),
  color: t.Optional(t.Union([t.String(), t.Null()], { description: '颜色（文件夹）' })),
  orderNum: t.Optional(t.Integer({ description: '排序序号' })),
  isPublic: t.Optional(t.Boolean({ description: '是否公开' })),
  tags: t.Optional(t.Array(t.String({ description: '标签' }), { description: '标签列表' })),
});
