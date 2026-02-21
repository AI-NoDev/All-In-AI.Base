/**
 * 操作日志模块 Schema 定义
 */

import { z } from 'zod';
import { operationLogZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 操作日志过滤条件 Schema */
export const operationLogFilterSchema = z.object({
  ids: z.array(z.string().describe('日志 ID')).optional().describe('日志 ID 列表，批量查询'),
  titles: z.array(z.string().describe('操作模块')).optional().describe('操作模块列表，批量查询'),
  names: z.array(z.string().describe('操作人员')).optional().describe('操作人员列表，批量查询'),
  status: z.enum(['0', '1']).optional().describe('状态：0=成功，1=失败'),
  title: z.string().optional().describe('操作模块（模糊匹配）'),
  name: z.string().optional().describe('操作人员（模糊匹配）'),
  timeStart: z.string().optional().describe('操作时间起始'),
  timeEnd: z.string().optional().describe('操作时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const operationLogSortSchema = z.object({
  field: z.enum(['title', 'name', 'time']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const operationLogPaginationBodySchema = z.object({
  filter: operationLogFilterSchema,
  sort: operationLogSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { operationLogZodSchemas };
