/**
 * 根据ID查询API密钥
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { apiKey, apiKeyMcp, apiKeySchemas } from '@qiyu-allinai/db/entities/ai';

export const apiKeyGetByPk = defineAction({
  meta: {
    name: 'ai.apiKey.getByPk',
    displayName: '根据ID查询API密钥',
    description: '根据API密钥ID获取详情，包含关联的MCP服务ID列表。URL参数id为API密钥UUID。返回null表示不存在。',
    tags: ['ai', 'apiKey'],
    method: 'GET',
    path: '/api/ai/api-key/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([
      t.Intersect([
        apiKeySchemas.select,
        t.Object({
          accessAll: t.Boolean(),
          mcpServerIds: t.Array(t.String()),
        })
      ]),
      t.Null()
    ]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(apiKey).where(eq(apiKey.id, input.id)).limit(1);
    if (!result) return null;
    
    const mcps = await db.select({ mcpServerId: apiKeyMcp.mcpServerId })
      .from(apiKeyMcp)
      .where(eq(apiKeyMcp.apiKeyId, result.id));
    
    return { ...result, mcpServerIds: mcps.map(m => m.mcpServerId) };
  },
});
