/**
 * 获取MCP服务Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { mcpServerZodSchemas } from './schemas';

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
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(mcpServerZodSchemas.select) as Record<string, unknown>;
  },
});
