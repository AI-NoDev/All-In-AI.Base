/**
 * 撤销API密钥
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { apiKey } from '@qiyu-allinai/db/entities/ai';
import type { ApiKeyInsert } from './utils';

export const apiKeyRevoke = defineAction({
  meta: {
    name: 'ai.apiKey.revoke',
    displayName: '撤销API密钥',
    description: `撤销指定的API密钥，使其立即失效。

**路径参数：**
- id: API密钥的UUID

**注意事项：**
- 撤销后密钥立即失效，无法恢复
- 使用该密钥的所有请求将被拒绝
- 建议在密钥泄露或不再需要时使用

**返回：**
- true: 撤销成功
- false: 未找到或撤销失败

**示例：**
POST /api/ai/api-key/550e8400-e29b-41d4-a716-446655440000/revoke`,
    tags: ['ai', 'apiKey'],
    method: 'POST',
    path: '/api/ai/api-key/:id/revoke',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db, currentUserName, currentUserId } = context;
    const [result] = await db.update(apiKey)
      .set({
        isRevoked: true,
        revokedAt: new Date().toISOString(),
        updatedBy: currentUserName,
        updatedById: currentUserId,
      } as Partial<ApiKeyInsert>)
      .where(eq(apiKey.id, input.id))
      .returning();
    return !!result;
  },
});
