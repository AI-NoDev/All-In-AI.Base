/**
 * AI模型模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { modelSchemas, type ModelSelect, type ModelInsert } from '@qiyu-allinai/db/entities/ai/model';

/** 模型过滤条件 Schema */
export const modelFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '模型ID' }), { description: '按ID列表精确匹配' })),
  modelIds: t.Optional(t.Array(t.String({ description: '模型标识' }), { description: '按模型标识列表精确匹配' })),
  providerId: t.Optional(t.String({ description: '按提供商ID精确匹配' })),
  providerIds: t.Optional(t.Array(t.String({ description: '提供商ID' }), { description: '按提供商ID列表精确匹配' })),
  name: t.Optional(t.String({ description: '按名称模糊搜索' })),
  modelId: t.Optional(t.String({ description: '按模型标识模糊搜索' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=正常，1=禁用' })),
  supportTools: t.Optional(t.Boolean({ description: '是否支持工具调用' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: '模型过滤条件' }));

/** 排序 Schema */
export const modelSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('name'), t.Literal('modelId'), t.Literal('createdAt'), t.Literal('updatedAt')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const modelPaginationBodySchema = t.Object({
  filter: modelFilterSchema,
  sort: modelSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});

/** 思考内容项 Schema */
export const thinkingItemSchema = t.Object({
  type: t.String({ description: '思考类型' }),
  text: t.String({ description: '思考内容文本' }),
}, { description: '思考内容项' });

/** 模型测试输出 Schema */
export const modelTestOutputSchema = t.Object({
  success: t.Boolean({ description: '测试是否成功' }),
  response: t.Union([t.String(), t.Null()], { description: '模型响应内容' }),
  thinking: t.Union([t.Array(thinkingItemSchema), t.Null()], { description: '思考过程内容' }),
  supportThinking: t.Boolean({ description: '是否支持思考模式' }),
  error: t.Union([t.String(), t.Null()], { description: '错误信息' }),
  latencyMs: t.Number({ description: '响应延迟（毫秒）' }),
}, { description: '模型测试输出' });
