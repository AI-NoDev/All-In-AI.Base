/**
 * 知识库收藏 Schemas (TypeBox)
 */

import { t } from 'elysia';
import { favoriteSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 请求体 Schemas ============
export const addFavoriteBodySchema = t.Object({
  nodeId: t.String({ description: '要收藏的节点 ID' }),
});

export const checkFavoriteBodySchema = t.Object({
  nodeIds: t.Array(t.String({ description: '节点 ID' }), { description: '要检查的节点 ID 列表' }),
});

export const listFavoriteBodySchema = t.Object({
  type: t.Optional(t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型：folder=文件夹，file=文件' })),
  limit: t.Integer({ minimum: 1, maximum: 100, default: 50, description: '每页数量' }),
  offset: t.Integer({ minimum: 0, default: 0, description: '偏移量' }),
});

// ============ 参数 Schemas ============
export const nodeIdParamsSchema = t.Object({
  nodeId: t.String({ description: '节点 ID' }),
});

// ============ 输出 Schemas ============
export const successOutputSchema = t.Object({
  success: t.Boolean({ description: '操作是否成功' }),
});

export const checkFavoriteOutputSchema = t.Object({
  favorites: t.Record(t.String(), t.Boolean(), { description: '收藏状态映射，key 为节点 ID，value 为是否已收藏' }),
});

export const listFavoriteOutputSchema = t.Object({
  data: t.Array(t.Object({
    favoriteId: t.String({ description: '收藏记录 ID' }),
    nodeId: t.String({ description: '节点 ID' }),
    type: t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型' }),
    name: t.String({ description: '节点名称' }),
    parentId: t.Union([t.String(), t.Null()], { description: '父文件夹 ID' }),
    icon: t.Union([t.String(), t.Null()], { description: '图标' }),
    color: t.Union([t.String(), t.Null()], { description: '颜色' }),
    extension: t.Union([t.String(), t.Null()], { description: '文件扩展名' }),
    mimeType: t.Union([t.String(), t.Null()], { description: 'MIME 类型' }),
    size: t.Number({ description: '文件大小（字节）' }),
    createdAt: t.String({ description: '节点创建时间' }),
    favoritedAt: t.String({ description: '收藏时间' }),
  }), { description: '收藏列表' }),
  total: t.Number({ description: '总数' }),
});

// ============ 导出 Schemas ============
export { favoriteSchemas };
