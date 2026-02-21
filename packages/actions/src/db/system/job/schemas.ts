/**
 * 定时任务模块 Schema 定义
 */

import { z } from 'zod';
import { jobZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 定时任务过滤条件 Schema */
export const jobFilterSchema = z.object({
  ids: z.array(z.string().describe('任务 ID')).optional().describe('任务 ID 列表，批量查询'),
  names: z.array(z.string().describe('任务名称')).optional().describe('任务名称列表，批量查询'),
  groups: z.array(z.string().describe('任务分组')).optional().describe('任务分组列表，批量查询'),
  status: z.enum(['0', '1']).optional().describe('状态：0=正常，1=暂停'),
  concurrent: z.boolean().optional().describe('是否允许并发执行'),
  name: z.string().optional().describe('任务名称（模糊匹配）'),
  group: z.string().optional().describe('任务分组（模糊匹配）'),
  createdAtStart: z.string().optional().describe('创建时间起始'),
  createdAtEnd: z.string().optional().describe('创建时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const jobSortSchema = z.object({
  field: z.enum(['name', 'group', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const jobPaginationBodySchema = z.object({
  filter: jobFilterSchema,
  sort: jobSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { jobZodSchemas };
