/**
 * 任务日志模块 Schema 定义
 */

import { z } from 'zod';
import { jobLogZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 任务日志过滤条件 Schema */
export const jobLogFilterSchema = z.object({
  ids: z.array(z.string().describe('日志 ID')).optional().describe('日志 ID 列表，批量查询'),
  jobNames: z.array(z.string().describe('任务名称')).optional().describe('任务名称列表，批量查询'),
  jobGroups: z.array(z.string().describe('任务分组')).optional().describe('任务分组列表，批量查询'),
  status: z.enum(['0', '1']).optional().describe('状态：0=成功，1=失败'),
  jobName: z.string().optional().describe('任务名称（模糊匹配）'),
  jobGroup: z.string().optional().describe('任务分组（模糊匹配）'),
  createdAtStart: z.string().optional().describe('创建时间起始'),
  createdAtEnd: z.string().optional().describe('创建时间结束'),
  startTimeStart: z.string().optional().describe('执行开始时间起始'),
  startTimeEnd: z.string().optional().describe('执行开始时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const jobLogSortSchema = z.object({
  field: z.enum(['jobName', 'jobGroup', 'startTime', 'stopTime', 'createdAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const jobLogPaginationBodySchema = z.object({
  filter: jobLogFilterSchema,
  sort: jobLogSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { jobLogZodSchemas };
