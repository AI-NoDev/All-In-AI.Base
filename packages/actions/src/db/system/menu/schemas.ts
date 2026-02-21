/**
 * 菜单模块 Schema 定义
 */

import { z } from 'zod';
import { menuZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 菜单过滤条件 Schema */
export const menuFilterSchema = z.object({
  ids: z.array(z.string().describe('菜单 ID')).optional().describe('菜单 ID 列表，批量查询'),
  names: z.array(z.string().describe('菜单名称')).optional().describe('菜单名称列表，批量查询'),
  types: z.array(z.string().describe('菜单类型')).optional().describe('菜单类型列表：M=目录，C=菜单，F=按钮'),
  parentId: z.string().nullable().optional().describe('父级菜单 ID，null 表示顶级菜单'),
  type: z.string().optional().describe('菜单类型：M=目录，C=菜单，F=按钮'),
  visible: z.boolean().optional().describe('是否可见'),
  name: z.string().optional().describe('菜单名称（模糊匹配）'),
  createdAtStart: z.string().optional().describe('创建时间起始'),
  createdAtEnd: z.string().optional().describe('创建时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const menuSortSchema = z.object({
  field: z.enum(['name', 'orderNum', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const menuPaginationBodySchema = z.object({
  filter: menuFilterSchema,
  sort: menuSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

// 重新导出实体 Schema
export { menuZodSchemas };
