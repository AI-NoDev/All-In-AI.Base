/**
 * 用户角色关联模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

/** 用户角色关联过滤条件 Schema */
export const userRoleFilterSchema = t.Optional(t.Object({
  userIds: t.Optional(t.Array(t.String({ description: '用户 ID' }), { description: '用户 ID 列表，批量查询' })),
  roleIds: t.Optional(t.Array(t.String({ description: '角色 ID' }), { description: '角色 ID 列表，批量查询' })),
  userId: t.Optional(t.String({ description: '用户 ID' })),
  roleId: t.Optional(t.String({ description: '角色 ID' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const userRoleSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('userId'), t.Literal('roleId')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const userRolePaginationBodySchema = t.Object({
  filter: userRoleFilterSchema,
  sort: userRoleSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
