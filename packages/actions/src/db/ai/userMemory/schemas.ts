/**
 * 用户记忆模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { userMemorySchemas, type UserMemorySelect, type UserMemoryInsert } from '@qiyu-allinai/db/entities/ai/userMemory';

/** 用户记忆过滤条件 Schema */
export const userMemoryFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '记忆ID' }), { description: '按ID列表精确匹配' })),
  userId: t.Optional(t.String({ description: '按用户ID精确匹配' })),
  userIds: t.Optional(t.Array(t.String({ description: '用户ID' }), { description: '按用户ID列表精确匹配' })),
  agentId: t.Optional(t.String({ description: '按Agent ID精确匹配（创建此记忆的Agent，可能是外部Agent）' })),
  agentIds: t.Optional(t.Array(t.String({ description: 'Agent ID' }), { description: '按Agent ID列表精确匹配' })),
  sessionId: t.Optional(t.String({ description: '按会话ID精确匹配' })),
  sessionIds: t.Optional(t.Array(t.String({ description: '会话ID' }), { description: '按会话ID列表精确匹配' })),
  memoryType: t.Optional(t.String({ description: '按记忆类型精确匹配：STM=短期，LTM=长期，PREFERENCE=偏好，FACT=事实，EPISODIC=情景' })),
  memoryTypes: t.Optional(t.Array(t.String({ description: '记忆类型' }), { description: '按记忆类型列表精确匹配' })),
  importanceMin: t.Optional(t.Number({ description: '重要性最小值（1-10）' })),
  importanceMax: t.Optional(t.Number({ description: '重要性最大值（1-10）' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=正常，1=禁用' })),
  content: t.Optional(t.String({ description: '按内容模糊搜索' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
  expireAtStart: t.Optional(t.String({ description: '过期时间范围-开始' })),
  expireAtEnd: t.Optional(t.String({ description: '过期时间范围-结束' })),
  includeExpired: t.Optional(t.Boolean({ description: '是否包含已过期记忆，默认false' })),
}, { description: '用户记忆过滤条件' }));

/** 排序 Schema */
export const userMemorySortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('importance'), t.Literal('accessCount'), t.Literal('lastAccessAt'),
    t.Literal('createdAt'), t.Literal('updatedAt'), t.Literal('expireAt')
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const userMemoryPaginationBodySchema = t.Object({
  filter: userMemoryFilterSchema,
  sort: userMemorySortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});

/** 语义检索请求体 Schema */
export const userMemorySemanticSearchBodySchema = t.Object({
  userId: t.String({ description: '用户ID' }),
  query: t.String({ description: '检索文本，将转换为向量进行相似度匹配' }),
  memoryTypes: t.Optional(t.Array(t.String(), { description: '限定记忆类型' })),
  topK: t.Number({ minimum: 1, maximum: 50, default: 10, description: '返回最相似的K条记忆' }),
  minSimilarity: t.Number({ minimum: 0, maximum: 1, default: 0.5, description: '最小相似度阈值（0-1）' }),
  includeExpired: t.Boolean({ default: false, description: '是否包含已过期记忆' }),
  considerDecay: t.Boolean({ default: true, description: '是否考虑记忆衰减' }),
});

/** 语义检索输出 Schema */
export const userMemorySemanticSearchOutputSchema = t.Object({
  data: t.Array(t.Object({
    id: t.String(),
    userId: t.String(),
    agentId: t.Union([t.String(), t.Null()]),
    sessionId: t.Union([t.String(), t.Null()]),
    memoryType: t.String(),
    content: t.String(),
    metadata: t.Unknown(),
    importance: t.Number(),
    accessCount: t.Number(),
    lastAccessAt: t.Union([t.String(), t.Null()]),
    expireAt: t.Union([t.String(), t.Null()]),
    embedding: t.Unknown(),
    status: t.String(),
    createdBy: t.String(),
    createdById: t.String(),
    updatedBy: t.String(),
    updatedById: t.String(),
    createdAt: t.String(),
    updatedAt: t.String(),
    similarity: t.Number({ description: '相似度得分（0-1）' }),
    decayScore: t.Optional(t.Number({ description: '衰减得分（0-1）' })),
  }), { description: '检索结果列表' }),
  total: t.Number({ description: '匹配总数' }),
}, { description: '语义检索输出' });
