/**
 * 字典模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { dictSchemas, type DictSelect, type DictInsert } from '@qiyu-allinai/db/entities/system/dict';

/** 字典过滤条件 Schema */
export const dictFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '字典ID' }), { description: '按ID列表精确匹配' })),
  groups: t.Optional(t.Array(t.String({ description: '字典分组键' }), { description: '按分组列表精确匹配' })),
  labels: t.Optional(t.Array(t.String({ description: '字典标签' }), { description: '按标签列表精确匹配' })),
  status: t.Optional(t.Union([t.Literal('0'), t.Literal('1')], { description: '按状态精确匹配：0=正常，1=禁用' })),
  isDefault: t.Optional(t.Boolean({ description: '是否默认值' })),
  group: t.Optional(t.String({ description: '按分组模糊搜索' })),
  label: t.Optional(t.String({ description: '按标签模糊搜索' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: '字典过滤条件' }));

/** 排序 Schema */
export const dictSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('group'), t.Literal('label'), t.Literal('sort'),
    t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const dictPaginationBodySchema = t.Object({
  filter: dictFilterSchema,
  sort: dictSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});
