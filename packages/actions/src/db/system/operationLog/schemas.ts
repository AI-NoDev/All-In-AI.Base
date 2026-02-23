/**
 * 操作日志模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { operationLogSchemas, type OperationLogSelect, type OperationLogInsert } from '@qiyu-allinai/db/entities/system/operationLog';

/** 操作日志过滤条件 Schema */
export const operationLogFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '日志ID' }), { description: '日志ID列表，批量查询' })),
  titles: t.Optional(t.Array(t.String({ description: '操作模块' }), { description: '操作模块列表，批量查询' })),
  names: t.Optional(t.Array(t.String({ description: '操作人员' }), { description: '操作人员列表，批量查询' })),
  status: t.Optional(t.Union([t.Literal('0'), t.Literal('1')], { description: '状态：0=成功，1=失败' })),
  title: t.Optional(t.String({ description: '操作模块（模糊匹配）' })),
  name: t.Optional(t.String({ description: '操作人员（模糊匹配）' })),
  timeStart: t.Optional(t.String({ description: '操作时间起始' })),
  timeEnd: t.Optional(t.String({ description: '操作时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const operationLogSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('title'), t.Literal('name'), t.Literal('time')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const operationLogPaginationBodySchema = t.Object({
  filter: operationLogFilterSchema,
  sort: operationLogSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
