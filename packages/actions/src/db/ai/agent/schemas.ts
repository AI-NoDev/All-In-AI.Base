/**
 * 智能体模块 Schema 定义
 */

import { z } from 'zod';

/** 智能体过滤条件 Schema */
export const agentFilterSchema = z.object({
  ids: z.array(z.string().describe('智能体ID')).optional().describe('按ID列表精确匹配'),
  names: z.array(z.string().describe('智能体名称')).optional().describe('按名称列表精确匹配'),
  providerId: z.string().optional().describe('按提供商ID精确匹配'),
  providerIds: z.array(z.string().describe('提供商ID')).optional().describe('按提供商ID列表精确匹配'),
  modelId: z.string().optional().describe('按模型ID精确匹配'),
  modelIds: z.array(z.string().describe('模型ID')).optional().describe('按模型ID列表精确匹配'),
  name: z.string().optional().describe('按名称模糊搜索'),
  status: z.string().optional().describe('按状态精确匹配：0=正常，1=禁用'),
  supportLoop: z.boolean().optional().describe('是否支持循环调用'),
  contextStrategy: z.string().optional().describe('上下文策略'),
  createdAtStart: z.iso.datetime().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.iso.datetime().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('智能体过滤条件');

/** 排序 Schema */
export const sortSchema = z.object({
  field: z.enum(['name', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询 Body Schema */
export const paginationBodySchema = z.object({
  filter: agentFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('智能体分页查询请求体');
