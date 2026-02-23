/**
 * 定时任务模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { jobSchemas, type JobSelect, type JobInsert } from '@qiyu-allinai/db/entities/system/job';

/** 定时任务过滤条件 Schema */
export const jobFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '任务 ID' }), { description: '任务 ID 列表，批量查询' })),
  names: t.Optional(t.Array(t.String({ description: '任务名称' }), { description: '任务名称列表，批量查询' })),
  groups: t.Optional(t.Array(t.String({ description: '任务分组' }), { description: '任务分组列表，批量查询' })),
  status: t.Optional(t.Union([t.Literal('0'), t.Literal('1')], { description: '状态：0=正常，1=暂停' })),
  concurrent: t.Optional(t.Boolean({ description: '是否允许并发执行' })),
  name: t.Optional(t.String({ description: '任务名称（模糊匹配）' })),
  group: t.Optional(t.String({ description: '任务分组（模糊匹配）' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const jobSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('name'), t.Literal('group'),
    t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const jobPaginationBodySchema = t.Object({
  filter: jobFilterSchema,
  sort: jobSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
