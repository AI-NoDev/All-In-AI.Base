/**
 * 字典组模块 Schema 定义
 */

import { z } from 'zod';
import { dictGroupZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 字典组过滤条件 Schema */
export const dictGroupFilterSchema = z.object({
  keys: z.array(z.string().describe('字典组键')).optional().describe('按字典组键列表精确匹配'),
  names: z.array(z.string().describe('字典组名称')).optional().describe('按字典组名称列表精确匹配'),
  status: z.enum(['0', '1']).optional().describe('按状态精确匹配：0=正常，1=禁用'),
  key: z.string().optional().describe('按字典组键模糊搜索'),
  name: z.string().optional().describe('按字典组名称模糊搜索'),
  createdAtStart: z.string().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.string().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('字典组过滤条件');

/** 排序 Schema */
export const dictGroupSortSchema = z.object({
  field: z.enum(['key', 'name', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const dictGroupPaginationBodySchema = z.object({
  filter: dictGroupFilterSchema,
  sort: dictGroupSortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('字典组分页查询请求体');

// 重新导出实体 Schema
export { dictGroupZodSchemas };
