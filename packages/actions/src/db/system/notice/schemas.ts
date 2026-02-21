/**
 * 通知公告模块 Schema 定义
 */

import { z } from 'zod';
import { noticeZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 通知过滤条件 Schema */
export const noticeFilterSchema = z.object({
  ids: z.array(z.string().describe('通知 ID')).optional().describe('通知 ID 列表，批量查询'),
  titles: z.array(z.string().describe('标题')).optional().describe('标题列表，批量查询'),
  types: z.array(z.string().describe('类型')).optional().describe('类型列表：1=通知，2=公告'),
  type: z.string().optional().describe('类型：1=通知，2=公告'),
  status: z.enum(['0', '1']).optional().describe('状态：0=正常，1=关闭'),
  title: z.string().optional().describe('标题（模糊匹配）'),
  createdAtStart: z.string().optional().describe('创建时间起始'),
  createdAtEnd: z.string().optional().describe('创建时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const noticeSortSchema = z.object({
  field: z.enum(['title', 'type', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const noticePaginationBodySchema = z.object({
  filter: noticeFilterSchema,
  sort: noticeSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { noticeZodSchemas };
