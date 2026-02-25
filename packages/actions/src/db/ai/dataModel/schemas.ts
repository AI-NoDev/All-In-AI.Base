/**
 * 数据模型模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { dataModelSchemas, type DataModelSelect, type DataModelInsert } from '@qiyu-allinai/db/entities/ai/dataModel';

/** 数据模型过滤条件 Schema */
export const dataModelFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '数据模型ID' }), { description: '按ID列表精确匹配' })),
  name: t.Optional(t.String({ description: '按名称模糊搜索' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=启用，1=禁用' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: '数据模型过滤条件' }));

/** 排序 Schema */
export const dataModelSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('name'), t.Literal('createdAt'), t.Literal('updatedAt')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const dataModelPaginationBodySchema = t.Object({
  filter: dataModelFilterSchema,
  sort: dataModelSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});
