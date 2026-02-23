/**
 * API密钥模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { apiKeySchemas, type ApiKeySelect, type ApiKeyInsert } from '@qiyu-allinai/db/entities/ai/apiKey';

/** API密钥过滤条件 Schema */
export const apiKeyFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: 'API密钥ID' }), { description: '按ID列表精确匹配' })),
  name: t.Optional(t.String({ description: '按名称模糊搜索' })),
  isRevoked: t.Optional(t.Boolean({ description: '是否已撤销' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=正常，1=禁用' })),
}, { description: 'API密钥过滤条件' }));

/** 排序 Schema */
export const apiKeySortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('createdAt'), t.Literal('name'), t.Literal('lastUsedAt')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询 Body Schema */
export const apiKeyPaginationBodySchema = t.Object({
  filter: apiKeyFilterSchema,
  sort: apiKeySortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});
