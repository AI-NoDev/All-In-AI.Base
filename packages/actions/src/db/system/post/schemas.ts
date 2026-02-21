/**
 * 岗位模块 Schema 定义
 */

import { z } from 'zod';
import { postZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 岗位过滤条件 Schema */
export const postFilterSchema = z.object({
  ids: z.array(z.string().describe('岗位 ID')).optional().describe('岗位 ID 列表，批量查询'),
  codes: z.array(z.string().describe('岗位编码')).optional().describe('岗位编码列表，批量查询'),
  names: z.array(z.string().describe('岗位名称')).optional().describe('岗位名称列表，批量查询'),
  status: z.enum(['0', '1']).optional().describe('状态：0=正常，1=禁用'),
  code: z.string().optional().describe('岗位编码（模糊匹配）'),
  name: z.string().optional().describe('岗位名称（模糊匹配）'),
  createdAtStart: z.string().optional().describe('创建时间起始'),
  createdAtEnd: z.string().optional().describe('创建时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const postSortSchema = z.object({
  field: z.enum(['code', 'name', 'sort', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const postPaginationBodySchema = z.object({
  filter: postFilterSchema,
  sort: postSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { postZodSchemas };
