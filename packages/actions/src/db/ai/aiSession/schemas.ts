/**
 * AI会话模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { aiSessionSchemas, type AISessionSelect, type AISessionInsert } from '@qiyu-allinai/db/entities/ai';

/** AI会话过滤条件 Schema */
export const aiSessionFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '会话ID' }), { description: '按ID列表精确匹配' })),
  userId: t.Optional(t.String({ description: '按用户ID精确匹配' })),
  userIds: t.Optional(t.Array(t.String({ description: '用户ID' }), { description: '按用户ID列表精确匹配' })),
  title: t.Optional(t.String({ description: '按标题模糊搜索' })),
  isArchived: t.Optional(t.Boolean({ description: '是否已归档' })),
  isPinned: t.Optional(t.Boolean({ description: '是否已置顶' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=正常，1=禁用' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
  lastMessageAtStart: t.Optional(t.String({ description: '最后消息时间范围-开始，ISO 8601格式' })),
  lastMessageAtEnd: t.Optional(t.String({ description: '最后消息时间范围-结束，ISO 8601格式' })),
}, { description: 'AI会话过滤条件' }));

/** 排序 Schema */
export const aiSessionSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('title'), t.Literal('lastMessageAt'), t.Literal('createdAt'),
    t.Literal('updatedAt'), t.Literal('messageCount'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const aiSessionPaginationBodySchema = t.Object({
  filter: aiSessionFilterSchema,
  sort: aiSessionSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});
