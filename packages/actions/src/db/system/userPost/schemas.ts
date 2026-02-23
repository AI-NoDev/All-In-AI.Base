/**
 * 用户岗位关联模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

/** 用户岗位关联过滤条件 Schema */
export const userPostFilterSchema = t.Optional(t.Object({
  userIds: t.Optional(t.Array(t.String({ description: '用户 ID' }), { description: '用户 ID 列表，批量查询' })),
  postIds: t.Optional(t.Array(t.String({ description: '岗位 ID' }), { description: '岗位 ID 列表，批量查询' })),
  userId: t.Optional(t.String({ description: '用户 ID' })),
  postId: t.Optional(t.String({ description: '岗位 ID' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const userPostSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('userId'), t.Literal('postId')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const userPostPaginationBodySchema = t.Object({
  filter: userPostFilterSchema,
  sort: userPostSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
