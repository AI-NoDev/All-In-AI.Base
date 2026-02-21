/**
 * 用户记忆模块 Schema 定义
 */

import { z } from 'zod';
import { userMemoryZodSchemas } from '@qiyu-allinai/db/entities/ai';

/** 用户记忆过滤条件 Schema */
export const userMemoryFilterSchema = z.object({
  ids: z.array(z.string().describe('记忆ID')).optional().describe('按ID列表精确匹配'),
  userId: z.string().optional().describe('按用户ID精确匹配'),
  userIds: z.array(z.string().describe('用户ID')).optional().describe('按用户ID列表精确匹配'),
  agentId: z.string().optional().describe('按Agent ID精确匹配（创建此记忆的Agent，可能是外部Agent）'),
  agentIds: z.array(z.string().describe('Agent ID')).optional().describe('按Agent ID列表精确匹配'),
  sessionId: z.string().optional().describe('按会话ID精确匹配'),
  sessionIds: z.array(z.string().describe('会话ID')).optional().describe('按会话ID列表精确匹配'),
  memoryType: z.string().optional().describe('按记忆类型精确匹配：STM=短期，LTM=长期，PREFERENCE=偏好，FACT=事实，EPISODIC=情景'),
  memoryTypes: z.array(z.string().describe('记忆类型')).optional().describe('按记忆类型列表精确匹配'),
  importanceMin: z.number().optional().describe('重要性最小值（1-10）'),
  importanceMax: z.number().optional().describe('重要性最大值（1-10）'),
  status: z.string().optional().describe('按状态精确匹配：0=正常，1=禁用'),
  content: z.string().optional().describe('按内容模糊搜索'),
  createdAtStart: z.string().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.string().optional().describe('创建时间范围-结束，ISO 8601格式'),
  expireAtStart: z.string().optional().describe('过期时间范围-开始'),
  expireAtEnd: z.string().optional().describe('过期时间范围-结束'),
  includeExpired: z.boolean().optional().describe('是否包含已过期记忆，默认false'),
}).optional().describe('用户记忆过滤条件');

/** 排序 Schema */
export const userMemorySortSchema = z.object({
  field: z.enum(['importance', 'accessCount', 'lastAccessAt', 'createdAt', 'updatedAt', 'expireAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const userMemoryPaginationBodySchema = z.object({
  filter: userMemoryFilterSchema,
  sort: userMemorySortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('用户记忆分页查询请求体');

/** 语义检索请求体 Schema */
export const userMemorySemanticSearchBodySchema = z.object({
  userId: z.string().describe('用户ID'),
  query: z.string().describe('检索文本，将转换为向量进行相似度匹配'),
  memoryTypes: z.array(z.string()).optional().describe('限定记忆类型'),
  topK: z.number().int().min(1).max(50).default(10).describe('返回最相似的K条记忆'),
  minSimilarity: z.number().min(0).max(1).default(0.5).describe('最小相似度阈值（0-1）'),
  includeExpired: z.boolean().default(false).describe('是否包含已过期记忆'),
  considerDecay: z.boolean().default(true).describe('是否考虑记忆衰减'),
}).describe('语义检索请求体');

/** 语义检索结果项 Schema */
export const userMemorySearchResultSchema = userMemoryZodSchemas.select.extend({
  similarity: z.number().describe('相似度得分（0-1）'),
  decayScore: z.number().optional().describe('衰减得分（0-1）'),
}).describe('语义检索结果项');

/** 语义检索输出 Schema */
export const userMemorySemanticSearchOutputSchema = z.object({
  data: z.array(userMemorySearchResultSchema).describe('检索结果列表'),
  total: z.number().describe('匹配总数'),
}).describe('语义检索输出');

// 重新导出实体 Schema
export { userMemoryZodSchemas };
