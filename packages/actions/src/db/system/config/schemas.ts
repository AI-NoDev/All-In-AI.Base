/**
 * 系统配置模块 Schema 定义
 */

import { z } from 'zod';
import { configZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 配置过滤条件 Schema */
export const configFilterSchema = z.object({
  ids: z.array(z.string().describe('配置ID')).optional().describe('按ID列表精确匹配'),
  names: z.array(z.string().describe('配置名称')).optional().describe('按配置名称列表精确匹配'),
  keys: z.array(z.string().describe('配置键')).optional().describe('按配置键列表精确匹配，如 ["sys.name", "sys.logo"]'),
  isSystem: z.boolean().optional().describe('是否系统内置配置'),
  name: z.string().optional().describe('按配置名称模糊搜索'),
  key: z.string().optional().describe('按配置键模糊搜索'),
  createdAtStart: z.string().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.string().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('配置过滤条件');

/** 排序 Schema */
export const configSortSchema = z.object({
  field: z.enum(['name', 'key', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const configPaginationBodySchema = z.object({
  filter: configFilterSchema,
  sort: configSortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('系统配置分页查询请求体');

// 重新导出实体 Schema
export { configZodSchemas };
