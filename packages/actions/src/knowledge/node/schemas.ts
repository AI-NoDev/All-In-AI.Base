/**
 * 知识库节点 Schemas
 */

import { z } from 'zod';

// ============ Filter Schema ============
export const nodeFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string().describe('节点 ID')).optional().describe('节点 ID 列表，批量查询'),
  types: z.array(z.enum(['folder', 'file'])).optional().describe('节点类型列表'),
  // 精确匹配
  parentId: z.string().nullable().optional().describe('父文件夹 ID，null 表示根目录'),
  type: z.enum(['folder', 'file']).optional().describe('节点类型：folder=文件夹，file=文件'),
  // 模糊匹配
  name: z.string().optional().describe('名称（模糊匹配）'),
  extension: z.string().optional().describe('文件扩展名'),
  // 时间范围
  createdAtStart: z.string().optional().describe('创建时间起始'),
  createdAtEnd: z.string().optional().describe('创建时间结束'),
  // 其他
  isPublic: z.boolean().optional().describe('是否公开'),
}).optional().describe('过滤条件');

export const nodeSortSchema = z.object({
  field: z.enum(['name', 'type', 'size', 'orderNum', 'createdAt', 'updatedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

export const nodePaginationBodySchema = z.object({
  filter: nodeFilterSchema,
  sort: nodeSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

export const nodeCreateBodySchema = z.object({
  type: z.enum(['folder', 'file']).describe('节点类型：folder=文件夹，file=文件'),
  parentId: z.string().nullable().optional().describe('父文件夹 ID，null 表示根目录'),
  name: z.string().min(1).max(255).describe('节点名称'),
  description: z.string().optional().describe('描述'),
  // 文件夹特有
  icon: z.string().optional().describe('图标（文件夹）'),
  color: z.string().optional().describe('颜色（文件夹）'),
  // 文件特有
  extension: z.string().optional().describe('文件扩展名'),
  mimeType: z.string().optional().describe('MIME 类型'),
  size: z.number().optional().describe('文件大小（字节）'),
  storageKey: z.string().optional().describe('存储键'),
  bucket: z.string().optional().describe('存储桶'),
  etag: z.string().optional().describe('ETag'),
  versionId: z.string().optional().describe('版本 ID'),
});

export const nodeUpdateBodySchema = z.object({
  name: z.string().min(1).max(255).optional().describe('节点名称'),
  description: z.string().nullable().optional().describe('描述'),
  icon: z.string().nullable().optional().describe('图标（文件夹）'),
  color: z.string().nullable().optional().describe('颜色（文件夹）'),
  orderNum: z.number().int().optional().describe('排序序号'),
  isPublic: z.boolean().optional().describe('是否公开'),
  tags: z.array(z.string().describe('标签')).optional().describe('标签列表'),
});
