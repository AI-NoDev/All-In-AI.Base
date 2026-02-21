/**
 * 部门模块 Schema 定义
 */

import { z } from 'zod';

/** 部门过滤条件 Schema */
export const departmentFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string().describe('部门 ID')).optional().describe('部门 ID 列表，批量查询'),
  names: z.array(z.string().describe('部门名称')).optional().describe('部门名称列表，批量查询'),
  // 精确匹配
  parentId: z.string().nullable().optional().describe('父部门 ID，null 表示顶级部门'),
  status: z.boolean().optional().describe('状态：true=启用，false=禁用'),
  // 模糊匹配
  name: z.string().optional().describe('部门名称（模糊匹配）'),
  // 时间范围
  createdAtStart: z.iso.datetime().optional().describe('创建时间起始'),
  createdAtEnd: z.iso.datetime().optional().describe('创建时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const sortSchema = z.object({
  field: z.enum(['name', 'orderNum', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询 Body Schema */
export const paginationBodySchema = z.object({
  filter: departmentFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});
