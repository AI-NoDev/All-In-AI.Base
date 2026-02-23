/**
 * MCP服务模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { mcpServerSchemas, type McpServerSelect, type McpServerInsert } from '@qiyu-allinai/db/entities/ai/mcpServer';

/** MCP服务过滤条件 Schema */
export const mcpServerFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: 'MCP服务ID' }), { description: '按ID列表精确匹配' })),
  name: t.Optional(t.String({ description: '按名称模糊搜索' })),
  isPublic: t.Optional(t.Boolean({ description: '是否公开访问' })),
  status: t.Optional(t.String({ description: '按状态精确匹配：0=正常，1=禁用' })),
}, { description: 'MCP服务过滤条件' }));

/** 排序 Schema */
export const mcpServerSortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('createdAt'), t.Literal('name')], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向：asc=升序，desc=降序' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const mcpServerPaginationBodySchema = t.Object({
  filter: mcpServerFilterSchema,
  sort: mcpServerSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '分页偏移量，从0开始' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量，1-100' }),
});

/** MCP配置输出 Schema */
export const mcpConfigSchema = t.Object({
  endpoint: t.String({ description: 'MCP服务端点URL' }),
  config: t.Object({
    mcpServers: t.Record(t.String(), t.Object({
      url: t.String({ description: '服务URL' }),
      headers: t.Optional(t.Object({
        Authorization: t.String({ description: '认证头' }),
      }, { description: '请求头配置' })),
    }, { description: 'MCP服务配置' }), { description: 'MCP服务映射' }),
  }, { description: 'MCP配置对象' }),
  configJson: t.String({ description: 'MCP配置JSON字符串' }),
}, { description: 'MCP配置输出' });
