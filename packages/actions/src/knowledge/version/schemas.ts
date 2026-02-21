/**
 * 知识库文件版本 Schemas
 */

import { z } from 'zod';
import { nodeVersionZodSchemas, nodeZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 参数 Schemas ============
export const nodeIdParamsSchema = z.object({
  id: z.string().describe('节点 ID'),
});

export const versionIdParamsSchema = z.object({
  id: z.string().describe('版本 ID'),
});

// ============ 输出 Schemas ============
export const versionListOutputSchema = z.object({
  data: z.array(nodeVersionZodSchemas.select).describe('版本列表'),
});

export const downloadUrlOutputSchema = z.object({
  url: z.string().describe('下载 URL'),
  expiresAt: z.string().describe('URL 过期时间'),
});

// ============ 分页查询 Schemas ============
export const versionFilterSchema = z.object({
  nodeIds: z.array(z.string().describe('节点 ID')).optional().describe('节点 ID 列表，批量查询'),
  nodeId: z.string().optional().describe('节点 ID，单个查询'),
  versionNumber: z.string().optional().describe('版本号'),
  createdAtStart: z.string().datetime().optional().describe('创建时间起始'),
  createdAtEnd: z.string().datetime().optional().describe('创建时间结束'),
}).optional().describe('过滤条件');

export const versionPaginationBodySchema = z.object({
  filter: versionFilterSchema,
  sort: z.object({
    field: z.enum(['versionNumber', 'size', 'createdAt']).describe('排序字段'),
    order: z.enum(['asc', 'desc']).describe('排序方向'),
  }).optional().describe('排序配置'),
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

export const versionPaginationOutputSchema = z.object({
  data: z.array(nodeVersionZodSchemas.select).describe('版本列表'),
  total: z.number().describe('总数'),
});

// ============ 导出 Schemas ============
export { nodeVersionZodSchemas, nodeZodSchemas };
