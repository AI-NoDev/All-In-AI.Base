/**
 * 角色模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

/** 角色过滤条件 Schema */
export const roleFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '角色 ID' }), { description: '角色 ID 列表，批量查询' })),
  names: t.Optional(t.Array(t.String({ description: '角色名称' }), { description: '角色名称列表，批量查询' })),
  keys: t.Optional(t.Array(t.String({ description: '角色标识' }), { description: '角色标识列表，批量查询' })),
  status: t.Optional(t.Union([t.Literal('0'), t.Literal('1')], { description: '状态：0=正常，1=禁用' })),
  name: t.Optional(t.String({ description: '角色名称（模糊匹配）' })),
  key: t.Optional(t.String({ description: '角色标识（模糊匹配）' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const roleSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('name'), t.Literal('key'), t.Literal('sort'),
    t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const rolePaginationBodySchema = t.Object({
  filter: roleFilterSchema,
  sort: roleSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
