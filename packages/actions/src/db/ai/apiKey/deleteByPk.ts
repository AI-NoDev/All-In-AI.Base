/**
 * 删除API密钥
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { apiKey, apiKeyMcp } from '@qiyu-allinai/db/entities/ai';

export const apiKeyDeleteByPk = defineAction({
  meta: {
    name: 'ai.apiKey.deleteByPk',
    displayName: '删除API密钥',
    description: `根据ID删除API密钥（物理删除）。

**路径参数：**
- id: API密钥的UUID

**注意事项：**
- 删除后无法恢复
- 会同时删除关联的MCP服务权限配置
- 建议先撤销再删除，或直接撤销而不删除（保留审计记录）

**返回：**
- true: 删除成功
- false: 未找到或删除失败

**示例：**
DELETE /api/ai/api-key/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'apiKey'],
    method: 'DELETE',
    path: '/api/ai/api-key/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 先删除关联
    await db.delete(apiKeyMcp).where(eq(apiKeyMcp.apiKeyId, input.id));
    // 再删除 API Key
    const [result] = await db.delete(apiKey).where(eq(apiKey.id, input.id)).returning();
    return !!result;
  },
});
