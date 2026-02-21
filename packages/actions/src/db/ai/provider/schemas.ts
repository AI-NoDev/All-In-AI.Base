/**
 * AI提供商模块 Schema 定义
 */

import { z } from 'zod';
import { providerZodSchemas } from '@qiyu-allinai/db/entities/ai';

/** 提供商过滤条件 Schema */
export const providerFilterSchema = z.object({
  ids: z.array(z.string().describe('提供商ID')).optional().describe('按ID列表精确匹配'),
  names: z.array(z.string().describe('提供商名称')).optional().describe('按名称列表精确匹配'),
  name: z.string().optional().describe('按名称模糊搜索'),
  status: z.string().optional().describe('按状态精确匹配：0=正常，1=禁用'),
  createdAtStart: z.string().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.string().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('提供商过滤条件');

/** 排序 Schema */
export const providerSortSchema = z.object({
  field: z.enum(['name', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const providerPaginationBodySchema = z.object({
  filter: providerFilterSchema,
  sort: providerSortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('AI提供商分页查询请求体');

// 重新导出实体 Schema
export { providerZodSchemas };
