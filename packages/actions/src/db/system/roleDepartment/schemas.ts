/**
 * 角色部门关联模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

/** 角色部门关联过滤条件 Schema */
export const roleDepartmentFilterSchema = t.Optional(t.Object({
  roleIds: t.Optional(t.Array(t.String({ description: '角色 ID' }), { description: '角色 ID 列表，批量查询' })),
  departmentIds: t.Optional(t.Array(t.String({ description: '部门 ID' }), { description: '部门 ID 列表，批量查询' })),
  roleId: t.Optional(t.String({ description: '角色 ID' })),
  departmentId: t.Optional(t.String({ description: '部门 ID' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const roleDepartmentSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('roleId'), t.Literal('departmentId')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const roleDepartmentPaginationBodySchema = t.Object({
  filter: roleDepartmentFilterSchema,
  sort: roleDepartmentSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
