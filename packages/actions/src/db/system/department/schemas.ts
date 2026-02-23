/**
 * 部门模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

/** 部门过滤条件 Schema */
export const departmentFilterSchema = t.Optional(t.Object({
  // IN 查询
  ids: t.Optional(t.Array(t.String({ description: '部门 ID' }), { description: '部门 ID 列表，批量查询' })),
  names: t.Optional(t.Array(t.String({ description: '部门名称' }), { description: '部门名称列表，批量查询' })),
  // 精确匹配
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父部门 ID，null 表示顶级部门' })),
  status: t.Optional(t.Boolean({ description: '状态：true=启用，false=禁用' })),
  // 模糊匹配
  name: t.Optional(t.String({ description: '部门名称（模糊匹配）' })),
  // 时间范围
  createdAtStart: t.Optional(t.String({ format: 'date-time', description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ format: 'date-time', description: '创建时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const sortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('name'), t.Literal('orderNum'),
    t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询 Body Schema */
export const paginationBodySchema = t.Object({
  filter: departmentFilterSchema,
  sort: sortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
