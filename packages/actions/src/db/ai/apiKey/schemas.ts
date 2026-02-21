/**
 * API密钥模块 Schema 定义
 */

import { z } from 'zod';
import { apiKeyZodSchemas } from '@qiyu-allinai/db/entities/ai';

/** API密钥过滤条件 Schema */
export const apiKeyFilterSchema = z.object({
  ids: z.array(z.string().describe('API密钥ID')).optional().describe('按ID列表精确匹配'),
  name: z.string().optional().describe('按名称模糊搜索'),
  isRevoked: z.boolean().optional().describe('是否已撤销'),
  status: z.string().optional().describe('按状态精确匹配：0=正常，1=禁用'),
}).optional().describe('API密钥过滤条件');

/** 排序 Schema */
export const sortSchema = z.object({
  field: z.enum(['createdAt', 'name', 'lastUsedAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询 Body Schema */
export const paginationBodySchema = z.object({
  filter: apiKeyFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('API密钥分页查询请求体');

/** 扩展的 select schema，包含关联的 MCP 服务 */
export const apiKeyWithMcpsSchema = apiKeyZodSchemas.select.extend({
  accessAll: z.boolean().describe('是否可访问所有MCP服务'),
  mcpServerIds: z.array(z.string().describe('MCP服务ID')).describe('可访问的MCP服务ID列表'),
}).describe('API密钥详情（含MCP服务关联）');

// 重新导出 db 层的 schemas
export { apiKeyZodSchemas };
