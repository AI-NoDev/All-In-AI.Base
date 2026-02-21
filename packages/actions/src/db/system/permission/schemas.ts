/**
 * 权限模块 Schema 定义
 */

import { z } from 'zod';
import { permissionZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 权限过滤条件 Schema */
export const permissionFilterSchema = z.object({
  ids: z.array(z.string().describe('权限 ID')).optional().describe('权限 ID 列表，批量查询'),
  codes: z.array(z.string().describe('权限编码')).optional().describe('权限编码列表，批量查询'),
  types: z.array(z.string().describe('权限类型')).optional().describe('权限类型列表：menu=菜单权限，button=按钮权限，api=接口权限'),
  modules: z.array(z.string().describe('模块名')).optional().describe('模块列表：system/ai/im/knowledge 等'),
  parentId: z.string().nullable().optional().describe('父级权限 ID，null 表示顶级权限'),
  status: z.boolean().optional().describe('状态：true=启用，false=禁用'),
  code: z.string().optional().describe('权限编码（模糊匹配）'),
  name: z.string().optional().describe('权限名称（模糊匹配）'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const permissionSortSchema = z.object({
  field: z.enum(['code', 'name', 'orderNum', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const permissionPaginationBodySchema = z.object({
  filter: permissionFilterSchema,
  sort: permissionSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(1000).default(100).describe('每页数量'),
});

// 重新导出实体 Schema
export { permissionZodSchemas };
