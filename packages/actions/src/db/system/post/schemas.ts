/**
 * 岗位模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { postSchemas, type PostSelect, type PostInsert } from '@qiyu-allinai/db/entities/system/post';

/** 岗位过滤条件 Schema */
export const postFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '岗位ID' }), { description: '岗位ID列表，批量查询' })),
  codes: t.Optional(t.Array(t.String({ description: '岗位编码' }), { description: '岗位编码列表，批量查询' })),
  names: t.Optional(t.Array(t.String({ description: '岗位名称' }), { description: '岗位名称列表，批量查询' })),
  status: t.Optional(t.Union([t.Literal('0'), t.Literal('1')], { description: '状态：0=正常，1=禁用' })),
  code: t.Optional(t.String({ description: '岗位编码（模糊匹配）' })),
  name: t.Optional(t.String({ description: '岗位名称（模糊匹配）' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const postSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('code'), t.Literal('name'), t.Literal('sort'),
    t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const postPaginationBodySchema = t.Object({
  filter: postFilterSchema,
  sort: postSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
