/**
 * IM 消息模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { messageSchemas, type MessageSelect, type MessageInsert } from '@qiyu-allinai/db/entities/im/message';

/** 消息过滤条件 Schema */
export const messageFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '消息ID' }), { description: '按ID列表精确匹配' })),
  conversationId: t.Optional(t.String({ description: '按会话ID精确匹配' })),
  conversationIds: t.Optional(t.Array(t.String({ description: '会话ID' }), { description: '按会话ID列表精确匹配' })),
  senderId: t.Optional(t.String({ description: '按发送者ID精确匹配' })),
  senderIds: t.Optional(t.Array(t.String({ description: '发送者ID' }), { description: '按发送者ID列表精确匹配' })),
  msgType: t.Optional(t.String({ description: '按消息类型精确匹配：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件' })),
  msgTypes: t.Optional(t.Array(t.String({ description: '消息类型' }), { description: '按消息类型列表精确匹配' })),
  isRecalled: t.Optional(t.Boolean({ description: '是否已撤回' })),
  msgSeqStart: t.Optional(t.Number({ description: '消息序号范围-开始' })),
  msgSeqEnd: t.Optional(t.Number({ description: '消息序号范围-结束' })),
  createdAtStart: t.Optional(t.String({ format: 'date-time', description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ format: 'date-time', description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: '消息过滤条件' }));

/** 排序 Schema */
export const messageSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('msgSeq'), t.Literal('createdAt')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询 Body Schema */
export const messagePaginationBodySchema = t.Object({
  filter: messageFilterSchema,
  sort: messageSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 50, description: '每页数量，1-100' }),
}, { description: 'IM消息分页查询请求体' });
