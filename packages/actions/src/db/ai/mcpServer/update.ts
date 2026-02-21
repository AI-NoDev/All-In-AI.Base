/**
 * 更新MCP服务
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { mcpServer } from '@qiyu-allinai/db/entities/ai';
import { mcpServerZodSchemas } from './schemas';
import type { McpServerSelect, McpServerInsert } from './utils';

export const mcpServerUpdate = defineAction({
  meta: {
    name: 'ai.mcpServer.update',
    displayName: '更新MCP服务',
    description: `根据ID更新单个MCP服务的配置信息。

**路径参数：**
- id: MCP服务的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- name: 服务名称
- description: 服务描述
- isPublic: 是否公开访问
- status: 状态，"0"=正常，"1"=禁用
- remark: 备注

**示例：**
\`\`\`json
PUT /api/ai/mcp-server/xxx-uuid
{
  "data": {
    "isPublic": true,
    "description": "更新后的描述"
  }
}
\`\`\``,
    tags: ['ai', 'mcpServer'],
    method: 'PUT',
    path: '/api/ai/mcp-server/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: mcpServerZodSchemas.update }),
    outputSchema: mcpServerZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(mcpServer)
      .set(input.data as Partial<McpServerInsert>)
      .where(eq(mcpServer.id, input.id))
      .returning();
    return result as McpServerSelect;
  },
});
