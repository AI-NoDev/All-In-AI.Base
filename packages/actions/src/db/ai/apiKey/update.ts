/**
 * 更新API密钥
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { apiKey, apiKeySchemas, apiKeyMcp } from '@qiyu-allinai/db/entities/ai';
import type { ApiKeySelect, ApiKeyInsert } from '@qiyu-allinai/db/entities/ai/apiKey';

export const apiKeyUpdate = defineAction({
  meta: {
    name: 'ai.apiKey.update',
    displayName: '更新API密钥',
    description: '更新API密钥信息和关联的MCP服务。URL参数id为密钥ID。可更新name、accessAll、mcpServerIds、expiresAt、remark。修改accessAll或mcpServerIds会重建MCP关联。示例：{"data":{"name":"新名称","accessAll":true}}',
    tags: ['ai', 'apiKey'],
    method: 'PUT',
    path: '/api/ai/api-key/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ 
      data: t.Object({
        name: t.Optional(t.String()),
        accessAll: t.Optional(t.Boolean()),
        mcpServerIds: t.Optional(t.Array(t.String())),
        expiresAt: t.Optional(t.Union([t.String(), t.Null()])),
        remark: t.Optional(t.Union([t.String(), t.Null()])),
      })
    }),
    outputSchema: apiKeySchemas.select,
  },
  execute: async (input, context) => {
    const { db, currentUserName, currentUserId } = context;
    
    // 更新基本信息
    const updateData: Partial<ApiKeyInsert> = {
      updatedBy: currentUserName,
      updatedById: currentUserId,
    };
    if (input.data.name !== undefined) updateData.name = input.data.name;
    if (input.data.accessAll !== undefined) updateData.accessAll = input.data.accessAll;
    if (input.data.expiresAt !== undefined) updateData.expiresAt = input.data.expiresAt ?? undefined;
    if (input.data.remark !== undefined) updateData.remark = input.data.remark ?? undefined;
    
    const [result] = await db.update(apiKey)
      .set(updateData)
      .where(eq(apiKey.id, input.id))
      .returning();
    
    if (!result) throw new Error('error.business.dataNotFound');
    
    // 更新 MCP 关联（仅当 accessAll 为 false 时才需要关联）
    if (input.data.accessAll !== undefined || input.data.mcpServerIds !== undefined) {
      const newAccessAll = input.data.accessAll ?? result.accessAll;
      
      // 先删除旧关联
      await db.delete(apiKeyMcp).where(eq(apiKeyMcp.apiKeyId, input.id));
      
      // 如果不是访问全部，且有选择的 MCP，则创建关联
      if (!newAccessAll && input.data.mcpServerIds && input.data.mcpServerIds.length > 0) {
        await db.insert(apiKeyMcp).values(
          input.data.mcpServerIds.map(mcpServerId => ({
            apiKeyId: input.id,
            mcpServerId,
          }))
        );
      }
    }
    
    return result as ApiKeySelect;
  },
});
