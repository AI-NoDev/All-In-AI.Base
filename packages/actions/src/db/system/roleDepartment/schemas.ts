/**
 * 角色部门关联模块 Schema 定义
 */

import { z } from 'zod';
import { roleDepartmentZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 角色部门关联过滤条件 Schema */
export const roleDepartmentFilterSchema = z.object({
  roleIds: z.array(z.string().describe('角色 ID')).optional().describe('角色 ID 列表，批量查询'),
  departmentIds: z.array(z.string().describe('部门 ID')).optional().describe('部门 ID 列表，批量查询'),
  roleId: z.string().optional().describe('角色 ID'),
  departmentId: z.string().optional().describe('部门 ID'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const roleDepartmentSortSchema = z.object({
  field: z.enum(['roleId', 'departmentId']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const roleDepartmentPaginationBodySchema = z.object({
  filter: roleDepartmentFilterSchema,
  sort: roleDepartmentSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { roleDepartmentZodSchemas };
