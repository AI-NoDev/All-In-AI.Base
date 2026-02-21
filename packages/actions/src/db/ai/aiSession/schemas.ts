/**
 * AI会话模块 Schema 定义
 */

import { z } from 'zod';
import { aiSessionZodSchemas } from '@qiyu-allinai/db/entities/ai';

/** AI会话过滤条件 Schema */
export const aiSessionFilterSchema = z.object({
  ids: z.array(z.string().describe('会话ID')).optional().describe('按ID列表精确匹配'),
  userId: z.string().optional().describe('按用户ID精确匹配'),
  userIds: z.array(z.string().describe('用户ID')).optional().describe('按用户ID列表精确匹配'),
  title: z.string().optional().describe('按标题模糊搜索'),
  isArchived: z.boolean().optional().describe('是否已归档'),
  isPinned: z.boolean().optional().describe('是否已置顶'),
  status: z.string().optional().describe('按状态精确匹配：0=正常，1=禁用'),
  createdAtStart: z.string().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.string().optional().describe('创建时间范围-结束，ISO 8601格式'),
  lastMessageAtStart: z.string().optional().describe('最后消息时间范围-开始，ISO 8601格式'),
  lastMessageAtEnd: z.string().optional().describe('最后消息时间范围-结束，ISO 8601格式'),
}).optional().describe('AI会话过滤条件');

/** 排序 Schema */
export const aiSessionSortSchema = z.object({
  field: z.enum(['title', 'lastMessageAt', 'createdAt', 'updatedAt', 'messageCount']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const aiSessionPaginationBodySchema = z.object({
  filter: aiSessionFilterSchema,
  sort: aiSessionSortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('AI会话分页查询请求体');

// 重新导出实体 Schema
export { aiSessionZodSchemas };
