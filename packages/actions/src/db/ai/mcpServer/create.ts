/**
 * 创建MCP服务
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { mcpServer } from '@qiyu-allinai/db/entities/ai';
import { mcpServerZodSchemas } from './schemas';
import type { McpServerSelect, McpServerInsert } from './utils';

export const mcpServerCreate = defineAction({
  meta: {
    name: 'ai.mcpServer.create',
    displayName: '创建MCP服务',
    description: `创建单个MCP服务配置。MCP服务用于暴露工具给AI调用。

**必填字段：**
- name: 服务名称（唯一标识）
- description: 服务描述

**可选字段：**
- isPublic: 是否公开访问，默认false（需要API Key）
- status: 状态，"0"=正常（默认），"1"=禁用
- remark: 备注

**示例：**
\`\`\`json
{
  "data": {
    "name": "weather-service",
    "description": "天气查询服务",
    "isPublic": false,
    "status": "0"
  }
}
\`\`\``,
    tags: ['ai', 'mcpServer'],
    method: 'POST',
    path: '/api/ai/mcp-server',
  },
  schemas: {
    bodySchema: z.object({ data: mcpServerZodSchemas.insert }),
    outputSchema: mcpServerZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(mcpServer).values(input.data as McpServerInsert).returning();
    return result as McpServerSelect;
  },
});
