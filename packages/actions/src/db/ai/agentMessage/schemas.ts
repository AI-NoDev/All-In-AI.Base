/**
 * Agent消息模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { agentMessageSchemas, type AgentMessageSelect, type AgentMessageInsert } from '@qiyu-allinai/db/entities/ai/agentMessage';

/** Agent消息过滤条件 Schema */
export const agentMessageFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '消息ID' }), { description: '按ID列表精确匹配' })),
  sessionId: t.Optional(t.String({ description: '按会话ID精确匹配' })),
  sessionIds: t.Optional(t.Array(t.String({ description: '会话ID' }), { description: '按会话ID列表精确匹配' })),
  role: t.Optional(t.String({ description: '按角色精确匹配：user=用户, assistant=助手, system=系统, tool=工具' })),
  roles: t.Optional(t.Array(t.String({ description: '角色' }), { description: '按角色列表精确匹配' })),
  contentType: t.Optional(t.String({ description: '按内容类型精确匹配' })),
  contentTypes: t.Optional(t.Array(t.String({ description: '内容类型' }), { description: '按内容类型列表精确匹配' })),
  finishReason: t.Optional(t.String({ description: '按完成原因精确匹配' })),
  msgSeqStart: t.Optional(t.Number({ description: '消息序号范围-开始' })),
  msgSeqEnd: t.Optional(t.Number({ description: '消息序号范围-结束' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间范围-开始，ISO 8601格式' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间范围-结束，ISO 8601格式' })),
}, { description: 'Agent消息过滤条件' }));

/** 排序 Schema */
export const agentMessageSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('msgSeq'), t.Literal('createdAt')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const agentMessagePaginationBodySchema = t.Object({
  filter: agentMessageFilterSchema,
  sort: agentMessageSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 50, description: '每页数量，1-100' }),
});
