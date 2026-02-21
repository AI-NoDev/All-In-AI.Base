/**
 * 根据ID查询MCP服务
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { mcpServer } from '@qiyu-allinai/db/entities/ai';
import { mcpServerZodSchemas } from './schemas';
import type { McpServerSelect } from './utils';

export const mcpServerGetByPk = defineAction({
  meta: {
    name: 'ai.mcpServer.getByPk',
    displayName: '根据ID查询MCP服务',
    description: `根据主键ID查询单个MCP服务的详细信息。

**路径参数：**
- id: MCP服务的UUID

**返回：**
- 找到时返回完整的MCP服务对象
- 未找到时返回 null

**示例：**
GET /api/ai/mcp-server/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'mcpServer'],
    method: 'GET',
    path: '/api/ai/mcp-server/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: mcpServerZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(mcpServer).where(eq(mcpServer.id, input.id)).limit(1);
    return (result as McpServerSelect) ?? null;
  },
});
