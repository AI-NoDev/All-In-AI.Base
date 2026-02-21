/**
 * 删除AI提供商
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { provider } from '@qiyu-allinai/db/entities/ai';

export const providerDeleteByPk = defineAction({
  meta: {
    name: 'ai.provider.deleteByPk',
    displayName: '删除AI提供商',
    description: `根据ID删除单个AI提供商（物理删除）。

**路径参数：**
- id: 提供商的UUID

**注意事项：**
- 删除后无法恢复
- 如果提供商下有关联的模型，需要先删除或迁移模型
- 建议先禁用而非直接删除

**返回：**
- true: 删除成功
- false: 未找到或删除失败

**示例：**
DELETE /api/ai/provider/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'provider'],
    method: 'DELETE',
    path: '/api/ai/provider/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(provider).where(eq(provider.id, input.id)).returning();
    return !!result;
  },
});
