/**
 * 任务日志模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { jobLogSchemas, type JobLogSelect, type JobLogInsert } from '@qiyu-allinai/db/entities/system/jobLog';

/** 任务日志过滤条件 Schema */
export const jobLogFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '日志 ID' }), { description: '日志 ID 列表，批量查询' })),
  jobNames: t.Optional(t.Array(t.String({ description: '任务名称' }), { description: '任务名称列表，批量查询' })),
  jobGroups: t.Optional(t.Array(t.String({ description: '任务分组' }), { description: '任务分组列表，批量查询' })),
  status: t.Optional(t.Union([t.Literal('0'), t.Literal('1')], { description: '状态：0=成功，1=失败' })),
  jobName: t.Optional(t.String({ description: '任务名称（模糊匹配）' })),
  jobGroup: t.Optional(t.String({ description: '任务分组（模糊匹配）' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间结束' })),
  startTimeStart: t.Optional(t.String({ description: '执行开始时间起始' })),
  startTimeEnd: t.Optional(t.String({ description: '执行开始时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const jobLogSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('jobName'), t.Literal('jobGroup'), t.Literal('startTime'),
    t.Literal('stopTime'), t.Literal('createdAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const jobLogPaginationBodySchema = t.Object({
  filter: jobLogFilterSchema,
  sort: jobLogSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
