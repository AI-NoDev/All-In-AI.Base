/**
 * 根据ID查询API密钥
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { apiKey, apiKeyMcp } from '@qiyu-allinai/db/entities/ai';
import { apiKeyWithMcpsSchema } from './schemas';

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
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: apiKeyWithMcpsSchema.nullable(),
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
