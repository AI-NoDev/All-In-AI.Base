/**
 * 创建API密钥
 */

import { t } from 'elysia';
import { inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { apiKey, apiKeyMcp, mcpServer } from '@qiyu-allinai/db/entities/ai';
import type { ApiKeyInsert } from '@qiyu-allinai/db/entities/ai/apiKey';

/**
 * 生成安全的随机 API Token
 */
function generateToken(): { token: string; hash: string; prefix: string } {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = 'sk_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const prefix = token.slice(0, 10) + '...';
  const hash = Bun.hash(token).toString(16);
  return { token, hash, prefix };
}

export const apiKeyCreate = defineAction({
  meta: {
    name: 'ai.apiKey.create',
    displayName: '创建API密钥',
    description: '创建新的API密钥用于MCP服务访问。accessAll=true表示可访问所有MCP服务，否则需指定mcpServerIds数组。创建成功后返回完整token（仅此一次显示）。示例：{"data":{"name":"我的密钥","accessAll":false,"mcpServerIds":["server-id-1"]}}',
    tags: ['ai', 'apiKey'],
    method: 'POST',
    path: '/api/ai/api-key',
  },
  schemas: {
    bodySchema: t.Object({ 
      data: t.Object({
        name: t.String(),
        accessAll: t.Boolean({ default: true }),
        mcpServerIds: t.Optional(t.Array(t.String(), { default: [] })),
        expiresAt: t.Optional(t.String()),
        remark: t.Optional(t.String()),
      })
    }),
    outputSchema: t.Object({
      id: t.String(),
      token: t.String(),
      tokenPrefix: t.String(),
    }),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    
    // 如果不是访问全部，需要验证 MCP Server 存在
    if (!input.data.accessAll && input.data.mcpServerIds && input.data.mcpServerIds.length > 0) {
      const servers = await db.select({ id: mcpServer.id })
        .from(mcpServer)
        .where(inArray(mcpServer.id, input.data.mcpServerIds));
      
      if (servers.length !== input.data.mcpServerIds.length) {
        throw new Error('error.business.dataNotFound');
      }
    }
    
    const { token, hash, prefix } = generateToken();
    
    // 创建 API Key
    const [result] = await db.insert(apiKey).values({
      name: input.data.name,
      tokenHash: hash,
      tokenPrefix: prefix,
      accessAll: input.data.accessAll,
      expiresAt: input.data.expiresAt,
      remark: input.data.remark,
      createdBy: currentUserName,
      updatedBy: currentUserName,
      createdById: currentUserId,
      updatedById: currentUserId,
    } as ApiKeyInsert).returning();
    
    if (!result) throw new Error('error.business.createFailed');
    
    // 如果不是访问全部，创建关联
    if (!input.data.accessAll && input.data.mcpServerIds && input.data.mcpServerIds.length > 0) {
      await db.insert(apiKeyMcp).values(
        input.data.mcpServerIds.map(mcpServerId => ({
          apiKeyId: result.id,
          mcpServerId,
        }))
      );
    }
    
    return { id: result.id, token, tokenPrefix: prefix };
  },
});
