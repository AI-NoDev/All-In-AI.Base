/**
 * 字典模块 Schema 定义
 */

import { z } from 'zod';
import { dictZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 字典过滤条件 Schema */
export const dictFilterSchema = z.object({
  ids: z.array(z.string().describe('字典ID')).optional().describe('按ID列表精确匹配'),
  groups: z.array(z.string().describe('字典分组键')).optional().describe('按分组列表精确匹配'),
  labels: z.array(z.string().describe('字典标签')).optional().describe('按标签列表精确匹配'),
  status: z.enum(['0', '1']).optional().describe('按状态精确匹配：0=正常，1=禁用'),
  isDefault: z.boolean().optional().describe('是否默认值'),
  group: z.string().optional().describe('按分组模糊搜索'),
  label: z.string().optional().describe('按标签模糊搜索'),
  createdAtStart: z.string().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.string().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('字典过滤条件');

/** 排序 Schema */
export const dictSortSchema = z.object({
  field: z.enum(['group', 'label', 'sort', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const dictPaginationBodySchema = z.object({
  filter: dictFilterSchema,
  sort: dictSortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('字典分页查询请求体');

// 重新导出实体 Schema
export { dictZodSchemas };
