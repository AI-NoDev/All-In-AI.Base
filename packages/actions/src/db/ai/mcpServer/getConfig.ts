/**
 * 获取MCP配置
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { mcpServer } from '@qiyu-allinai/db/entities/ai';
import { mcpConfigSchema } from './schemas';

export const mcpServerGetConfig = defineAction({
  meta: {
    name: 'ai.mcpServer.getConfig',
    displayName: '获取MCP配置',
    description: `获取MCP服务的配置JSON，用于集成到AI工具（如Claude Desktop、Cursor等）。

**路径参数：**
- id: MCP服务的UUID

**返回：**
- endpoint: MCP服务端点URL
- config: 配置对象，可直接用于AI工具配置
- configJson: 格式化的JSON字符串

**使用方式：**
将返回的 configJson 复制到AI工具的MCP配置文件中。
如果服务不是公开的，需要替换 <YOUR_API_KEY> 为实际的API Key。

**示例响应：**
\`\`\`json
{
  "endpoint": "http://localhost:3030/mcp/xxx-uuid",
  "config": {
    "mcpServers": {
      "weather-service": {
        "url": "http://localhost:3030/mcp/xxx-uuid",
        "headers": { "Authorization": "Bearer <YOUR_API_KEY>" }
      }
    }
  },
  "configJson": "..."
}
\`\`\``,
    tags: ['ai', 'mcpServer'],
    method: 'GET',
    path: '/api/ai/mcp-server/:id/config',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: mcpConfigSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [server] = await db.select().from(mcpServer).where(eq(mcpServer.id, input.id)).limit(1);
    if (!server) throw new Error('error.mcp.server.notFound');

    const baseUrl = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 3030}`;
    const endpoint = `${baseUrl}/mcp/${server.id}`;

    const serverConfig: { url: string; headers?: { Authorization: string } } = { url: endpoint };
    if (!server.isPublic) {
      serverConfig.headers = { Authorization: 'Bearer <YOUR_API_KEY>' };
    }

    const config = {
      mcpServers: {
        [server.name]: serverConfig,
      },
    };

    return {
      endpoint,
      config,
      configJson: JSON.stringify(config, null, 2),
    };
  },
});
