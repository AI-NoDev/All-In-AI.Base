/**
 * 登录日志模块 Schema 定义
 */

import { z } from 'zod';
import { loginInfoZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 登录日志过滤条件 Schema */
export const loginInfoFilterSchema = z.object({
  ids: z.array(z.string().describe('日志 ID')).optional().describe('日志 ID 列表，批量查询'),
  loginNames: z.array(z.string().describe('登录账号')).optional().describe('登录账号列表，批量查询'),
  status: z.enum(['0', '1']).optional().describe('状态：0=成功，1=失败'),
  loginName: z.string().optional().describe('登录账号（模糊匹配）'),
  ipaddr: z.string().optional().describe('IP 地址（模糊匹配）'),
  createdAtStart: z.string().optional().describe('创建时间起始'),
  createdAtEnd: z.string().optional().describe('创建时间结束'),
  loginTimeStart: z.string().optional().describe('登录时间起始'),
  loginTimeEnd: z.string().optional().describe('登录时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const loginInfoSortSchema = z.object({
  field: z.enum(['loginName', 'ipaddr', 'loginTime', 'createdAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const loginInfoPaginationBodySchema = z.object({
  filter: loginInfoFilterSchema,
  sort: loginInfoSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { loginInfoZodSchemas };
