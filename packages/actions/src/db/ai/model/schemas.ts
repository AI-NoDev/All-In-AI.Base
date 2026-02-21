/**
 * AI模型模块 Schema 定义
 */

import { z } from 'zod';
import { modelZodSchemas } from '@qiyu-allinai/db/entities/ai';

/** 模型过滤条件 Schema */
export const modelFilterSchema = z.object({
  ids: z.array(z.string().describe('模型ID')).optional().describe('按ID列表精确匹配'),
  modelIds: z.array(z.string().describe('模型标识')).optional().describe('按模型标识列表精确匹配'),
  providerId: z.string().optional().describe('按提供商ID精确匹配'),
  providerIds: z.array(z.string().describe('提供商ID')).optional().describe('按提供商ID列表精确匹配'),
  name: z.string().optional().describe('按名称模糊搜索'),
  modelId: z.string().optional().describe('按模型标识模糊搜索'),
  status: z.string().optional().describe('按状态精确匹配：0=正常，1=禁用'),
  supportTools: z.boolean().optional().describe('是否支持工具调用'),
  createdAtStart: z.string().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.string().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('模型过滤条件');

/** 排序 Schema */
export const modelSortSchema = z.object({
  field: z.enum(['name', 'modelId', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const modelPaginationBodySchema = z.object({
  filter: modelFilterSchema,
  sort: modelSortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('AI模型分页查询请求体');

/** 思考内容项 Schema */
export const thinkingItemSchema = z.object({
  type: z.string().describe('思考类型'),
  text: z.string().describe('思考内容文本'),
}).describe('思考内容项');

/** 模型测试输出 Schema */
export const modelTestOutputSchema = z.object({
  success: z.boolean().describe('测试是否成功'),
  response: z.string().nullable().describe('模型响应内容'),
  thinking: z.array(thinkingItemSchema).nullable().describe('思考过程内容'),
  supportThinking: z.boolean().describe('是否支持思考模式'),
  error: z.string().nullable().describe('错误信息'),
  latencyMs: z.number().describe('响应延迟（毫秒）'),
}).describe('模型测试输出');

// 重新导出实体 Schema
export { modelZodSchemas };
