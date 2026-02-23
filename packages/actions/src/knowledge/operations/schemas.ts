/**
 * 知识库节点操作 Schemas (TypeBox)
 */

import { t } from 'elysia';
import { nodeSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 参数 Schemas ============
export const nodeIdParamsSchema = t.Object({
  id: t.String({ description: '节点 ID' }),
});

// ============ 移动/复制 Schemas ============
export const moveBodySchema = t.Object({
  targetParentId: t.Union([t.String(), t.Null()], { description: '目标父文件夹 ID，null 表示移动到根目录' }),
});

export const copyBodySchema = t.Object({
  targetParentId: t.Union([t.String(), t.Null()], { description: '目标父文件夹 ID，null 表示复制到根目录' }),
});

// ============ 检查存在 Schemas ============
export const checkExistsBodySchema = t.Object({
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父文件夹 ID，null 表示根目录' })),
  names: t.Array(t.String({ minLength: 1, maxLength: 255, description: '文件/文件夹名' }), { description: '要检查的名称列表' }),
  type: t.Optional(t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型：folder=文件夹，file=文件' })),
});

export const checkExistsOutputSchema = t.Object({
  exists: t.Array(t.Object({
    name: t.String({ description: '文件/文件夹名' }),
    nodeId: t.String({ description: '已存在的节点 ID' }),
    type: t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型' }),
    size: t.Number({ description: '文件大小（字节）' }),
    updatedAt: t.String({ description: '更新时间' }),
  }), { description: '已存在的节点列表' }),
});

// ============ 路径 Schemas ============
export const pathOutputSchema = t.Object({
  data: t.Array(t.Object({
    id: t.String({ description: '节点 ID' }),
    name: t.String({ description: '节点名称' }),
    type: t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型' }),
  }), { description: '从根到当前节点的路径' }),
});

// ============ 排序 Schemas ============
export const updateOrderBodySchema = t.Object({
  items: t.Array(t.Object({
    id: t.String({ description: '节点 ID' }),
    orderNum: t.Integer({ description: '排序序号' }),
  }), { description: '排序项列表' }),
});

export const updateOrderOutputSchema = t.Object({
  success: t.Boolean({ description: '操作是否成功' }),
  updatedCount: t.Number({ description: '更新的节点数' }),
});

// ============ 搜索 Schemas ============
export const searchBodySchema = t.Object({
  keyword: t.String({ minLength: 1, maxLength: 100, description: '搜索关键词' }),
  type: t.Optional(t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型：folder=文件夹，file=文件' })),
  limit: t.Integer({ minimum: 1, maximum: 50, default: 20, description: '返回数量限制' }),
});

export const searchOutputSchema = t.Object({
  data: t.Array(nodeSchemas.select, { description: '搜索结果列表' }),
});

// ============ 导出节点 Schema ============
export { nodeSchemas };
