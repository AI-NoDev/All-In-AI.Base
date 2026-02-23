/**
 * 系统配置模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

/** 配置过滤条件 Schema */
export const configFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '配置ID' }), { description: '按ID列表精确匹配' })),
  names: t.Optional(t.Array(t.String({ description: '配置名称' }), { description: '按配置名称列表精确匹配' })),
  keys: t.Optional(t.Array(t.String({ description: '配置键' }), { description: '按配置键列表精确匹配，如 ["sys.name", "sys.logo"]' })),
  isSystem: t.Optional(t.Boolean({ description: '是否系统内置配置' })),
  name: t.Optional(t.String({ description: '按配置名称模糊搜索' })),
  key: t.Optional(t.String({ description: '按配置键模糊搜索' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: '配置过滤条件' }));

/** 排序 Schema */
export const configSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('name'), t.Literal('key'),
    t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const configPaginationBodySchema = t.Object({
  filter: configFilterSchema,
  sort: configSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});
