/**
 * IM 会话模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { conversationSchemas, type ConversationSelect, type ConversationInsert } from '@qiyu-allinai/db/entities/im/conversation';

/** 会话过滤条件 Schema */
export const conversationFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '会话ID' }), { description: '按ID列表精确匹配' })),
  type: t.Optional(t.String({ description: '按会话类型精确匹配：01=单聊，02=群聊' })),
  types: t.Optional(t.Array(t.String({ description: '会话类型' }), { description: '按会话类型列表精确匹配' })),
  ownerId: t.Optional(t.String({ description: '按群主ID精确匹配' })),
  name: t.Optional(t.String({ description: '按会话名称模糊搜索' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=正常，1=禁用' })),
  isTop: t.Optional(t.Boolean({ description: '是否置顶' })),
  isMuted: t.Optional(t.Boolean({ description: '是否静音' })),
  lastMessageAtStart: t.Optional(t.String({ format: 'date-time', description: '最后消息时间范围-开始，ISO 8601格式' })),
  lastMessageAtEnd: t.Optional(t.String({ format: 'date-time', description: '最后消息时间范围-结束，ISO 8601格式' })),
  createdAtStart: t.Optional(t.String({ format: 'date-time', description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ format: 'date-time', description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: '会话过滤条件' }));

/** 排序 Schema */
export const conversationSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('name'),
    t.Literal('lastMessageAt'),
    t.Literal('createdAt'),
    t.Literal('updatedAt'),
    t.Literal('memberCount'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询 Body Schema */
export const conversationPaginationBodySchema = t.Object({
  filter: conversationFilterSchema,
  sort: conversationSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
}, { description: 'IM会话分页查询请求体' });
