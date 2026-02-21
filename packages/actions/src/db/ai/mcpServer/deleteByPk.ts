/**
 * 删除MCP服务
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { mcpServer } from '@qiyu-allinai/db/entities/ai';

export const mcpServerDeleteByPk = defineAction({
  meta: {
    name: 'ai.mcpServer.deleteByPk',
    displayName: '删除MCP服务',
    description: `根据ID删除单个MCP服务（物理删除）。

**路径参数：**
- id: MCP服务的UUID

**注意事项：**
- 删除后无法恢复
- 关联的API Key权限配置会失效

**返回：**
- true: 删除成功
- false: 未找到或删除失败

**示例：**
DELETE /api/ai/mcp-server/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'mcpServer'],
    method: 'DELETE',
    path: '/api/ai/mcp-server/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(mcpServer).where(eq(mcpServer.id, input.id)).returning();
    return !!result;
  },
});
