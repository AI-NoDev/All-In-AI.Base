/**
 * 智能体模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { agentSchemas, type AgentSelect, type AgentInsert } from '@qiyu-allinai/db/entities/ai/agent';

/** 智能体过滤条件 Schema */
export const agentFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '智能体ID' }), { description: '按ID列表精确匹配' })),
  names: t.Optional(t.Array(t.String({ description: '智能体名称' }), { description: '按名称列表精确匹配' })),
  providerId: t.Optional(t.String({ description: '按提供商ID精确匹配' })),
  providerIds: t.Optional(t.Array(t.String({ description: '提供商ID' }), { description: '按提供商ID列表精确匹配' })),
  modelId: t.Optional(t.String({ description: '按模型ID精确匹配' })),
  modelIds: t.Optional(t.Array(t.String({ description: '模型ID' }), { description: '按模型ID列表精确匹配' })),
  name: t.Optional(t.String({ description: '按名称模糊搜索' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=正常，1=禁用' })),
  supportLoop: t.Optional(t.Boolean({ description: '是否支持循环调用' })),
  contextStrategy: t.Optional(t.String({ description: '上下文策略' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: '智能体过滤条件' }));

/** 排序 Schema */
export const agentSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('name'), t.Literal('createdAt'), t.Literal('updatedAt')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询 Body Schema */
export const agentPaginationBodySchema = t.Object({
  filter: agentFilterSchema,
  sort: agentSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});
