/**
 * Agent消息模块 Schema 定义
 */

import { z } from 'zod';
import { agentMessageZodSchemas } from '@qiyu-allinai/db/entities/ai';

/** Agent消息过滤条件 Schema */
export const agentMessageFilterSchema = z.object({
  ids: z.array(z.string().describe('消息ID')).optional().describe('按ID列表精确匹配'),
  sessionId: z.string().optional().describe('按会话ID精确匹配'),
  sessionIds: z.array(z.string().describe('会话ID')).optional().describe('按会话ID列表精确匹配'),
  role: z.string().optional().describe('按角色精确匹配：user=用户, assistant=助手, system=系统, tool=工具'),
  roles: z.array(z.string().describe('角色')).optional().describe('按角色列表精确匹配'),
  contentType: z.string().optional().describe('按内容类型精确匹配'),
  contentTypes: z.array(z.string().describe('内容类型')).optional().describe('按内容类型列表精确匹配'),
  finishReason: z.string().optional().describe('按完成原因精确匹配'),
  msgSeqStart: z.number().optional().describe('消息序号范围-开始'),
  msgSeqEnd: z.number().optional().describe('消息序号范围-结束'),
  createdAtStart: z.string().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.string().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('Agent消息过滤条件');

/** 排序 Schema */
export const agentMessageSortSchema = z.object({
  field: z.enum(['msgSeq', 'createdAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const agentMessagePaginationBodySchema = z.object({
  filter: agentMessageFilterSchema,
  sort: agentMessageSortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(50).describe('每页数量，1-100'),
}).describe('Agent消息分页查询请求体');

// 重新导出实体 Schema
export { agentMessageZodSchemas };
