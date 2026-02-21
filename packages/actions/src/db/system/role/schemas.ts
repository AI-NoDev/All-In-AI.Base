/**
 * 角色模块 Schema 定义
 */

import { z } from 'zod';
import { roleZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 角色过滤条件 Schema */
export const roleFilterSchema = z.object({
  ids: z.array(z.string().describe('角色 ID')).optional().describe('角色 ID 列表，批量查询'),
  names: z.array(z.string().describe('角色名称')).optional().describe('角色名称列表，批量查询'),
  keys: z.array(z.string().describe('角色标识')).optional().describe('角色标识列表，批量查询'),
  status: z.enum(['0', '1']).optional().describe('状态：0=正常，1=禁用'),
  name: z.string().optional().describe('角色名称（模糊匹配）'),
  key: z.string().optional().describe('角色标识（模糊匹配）'),
  createdAtStart: z.string().optional().describe('创建时间起始'),
  createdAtEnd: z.string().optional().describe('创建时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const roleSortSchema = z.object({
  field: z.enum(['name', 'key', 'sort', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const rolePaginationBodySchema = z.object({
  filter: roleFilterSchema,
  sort: roleSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { roleZodSchemas };
