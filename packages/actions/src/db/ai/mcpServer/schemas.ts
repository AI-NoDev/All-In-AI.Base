/**
 * MCP服务模块 Schema 定义
 */

import { z } from 'zod';
import { mcpServerZodSchemas } from '@qiyu-allinai/db/entities/ai';

/** MCP服务过滤条件 Schema */
export const mcpServerFilterSchema = z.object({
  ids: z.array(z.string().describe('MCP服务ID')).optional().describe('按ID列表精确匹配'),
  name: z.string().optional().describe('按名称模糊搜索'),
  isPublic: z.boolean().optional().describe('是否公开访问'),
  status: z.string().optional().describe('按状态精确匹配：0=正常，1=禁用'),
}).optional().describe('MCP服务过滤条件');

/** 排序 Schema */
export const mcpServerSortSchema = z.object({
  field: z.enum(['createdAt', 'name']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询请求体 Schema */
export const mcpServerPaginationBodySchema = z.object({
  filter: mcpServerFilterSchema,
  sort: mcpServerSortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('MCP服务分页查询请求体');

/** MCP配置输出 Schema */
export const mcpConfigSchema = z.object({
  endpoint: z.string().describe('MCP服务端点URL'),
  config: z.object({
    mcpServers: z.record(z.string(), z.object({
      url: z.string().describe('服务URL'),
      headers: z.object({
        Authorization: z.string().describe('认证头'),
      }).optional().describe('请求头配置'),
    }).describe('MCP服务配置')).describe('MCP服务映射'),
  }).describe('MCP配置对象'),
  configJson: z.string().describe('MCP配置JSON字符串'),
}).describe('MCP配置输出');

// 重新导出实体 Schema
export { mcpServerZodSchemas };
