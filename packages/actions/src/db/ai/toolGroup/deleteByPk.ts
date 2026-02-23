/**
 * 删除工具组
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toolGroup } from '@qiyu-allinai/db/entities/ai';

export const toolGroupDeleteByPk = defineAction({
  meta: {
    name: 'ai.toolGroup.deleteByPk',
    displayName: '删除工具组',
    description: `根据ID物理删除工具组。

**示例：**
DELETE /api/ai/tool-group/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'toolGroup'],
    method: 'DELETE',
    path: '/api/ai/tool-group/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(toolGroup).where(eq(toolGroup.id, input.id)).returning();
    return !!result;
  },
});
