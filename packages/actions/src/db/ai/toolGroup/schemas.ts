/**
 * 工具组模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { toolGroupSchemas, type ToolGroupSelect, type ToolGroupInsert } from '@qiyu-allinai/db/entities/ai/toolGroup';

/** 工具组过滤条件 Schema */
export const toolGroupFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '工具组ID' }), { description: '按ID列表精确匹配' })),
  names: t.Optional(t.Array(t.String({ description: '工具组名称' }), { description: '按名称列表精确匹配' })),
  name: t.Optional(t.String({ description: '按名称模糊搜索' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=正常，1=禁用' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: '工具组过滤条件' }));

/** 排序 Schema */
export const toolGroupSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('name'), t.Literal('orderNum'), t.Literal('createdAt'), t.Literal('updatedAt')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const toolGroupPaginationBodySchema = t.Object({
  filter: toolGroupFilterSchema,
  sort: toolGroupSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});
