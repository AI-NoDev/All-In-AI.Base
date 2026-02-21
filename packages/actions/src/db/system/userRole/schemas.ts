/**
 * 用户角色关联模块 Schema 定义
 */

import { z } from 'zod';
import { userRoleZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 用户角色关联过滤条件 Schema */
export const userRoleFilterSchema = z.object({
  userIds: z.array(z.string().describe('用户 ID')).optional().describe('用户 ID 列表，批量查询'),
  roleIds: z.array(z.string().describe('角色 ID')).optional().describe('角色 ID 列表，批量查询'),
  userId: z.string().optional().describe('用户 ID'),
  roleId: z.string().optional().describe('角色 ID'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const userRoleSortSchema = z.object({
  field: z.enum(['userId', 'roleId']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const userRolePaginationBodySchema = z.object({
  filter: userRoleFilterSchema,
  sort: userRoleSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { userRoleZodSchemas };
