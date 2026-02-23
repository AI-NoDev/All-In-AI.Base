/**
 * 权限模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { permissionSchemas, type PermissionSelect, type PermissionInsert } from '@qiyu-allinai/db/entities/system/permission';

/** 权限过滤条件 Schema */
export const permissionFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '权限ID' }), { description: '权限ID列表，批量查询' })),
  codes: t.Optional(t.Array(t.String({ description: '权限编码' }), { description: '权限编码列表，批量查询' })),
  types: t.Optional(t.Array(t.String({ description: '权限类型' }), { description: '权限类型列表：menu=菜单权限，button=按钮权限，api=接口权限' })),
  modules: t.Optional(t.Array(t.String({ description: '模块名' }), { description: '模块列表：system/ai/im/knowledge等' })),
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父级权限ID，null表示顶级权限' })),
  status: t.Optional(t.Boolean({ description: '状态：true=启用，false=禁用' })),
  code: t.Optional(t.String({ description: '权限编码（模糊匹配）' })),
  name: t.Optional(t.String({ description: '权限名称（模糊匹配）' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const permissionSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('code'), t.Literal('name'), t.Literal('orderNum'),
    t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const permissionPaginationBodySchema = t.Object({
  filter: permissionFilterSchema,
  sort: permissionSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 1000, default: 100, description: '每页数量' }),
});
