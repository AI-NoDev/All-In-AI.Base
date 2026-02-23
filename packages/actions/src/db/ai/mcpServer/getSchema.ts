/**
 * 获取MCP服务Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { mcpServerSchemas } from './schemas';

export const mcpServerGetSchema = defineAction({
  meta: {
    name: 'ai.mcpServer.getSchema',
    ignoreTools: true,
    displayName: '获取MCP服务Schema',
    description: `获取MCP服务表的JSON Schema定义。

**返回：** JSON Schema 对象

**使用场景：**
- 前端动态生成表单
- API文档生成`,
    tags: ['ai', 'mcpServer'],
    method: 'GET',
    path: '/api/ai/mcp-server/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(mcpServerSchemas.select) as Record<string, unknown>;
  },
});
