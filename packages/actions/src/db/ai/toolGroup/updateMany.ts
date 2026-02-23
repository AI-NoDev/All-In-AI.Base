/**
 * 批量更新工具组
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toolGroup, toolGroupSchemas } from '@qiyu-allinai/db/entities/ai';
import type { ToolGroupSelect, ToolGroupInsert } from '@qiyu-allinai/db/entities/ai/toolGroup';

export const toolGroupUpdateMany = defineAction({
  meta: {
    name: 'ai.toolGroup.updateMany',
    ignoreTools: true,
    displayName: '批量更新工具组',
    description: `根据ID列表批量更新工具组。

**示例：**
\`\`\`json
{
  "ids": ["id1", "id2"],
  "data": { "status": "1" }
}
\`\`\``,
    tags: ['ai', 'toolGroup'],
    method: 'PUT',
    path: '/api/ai/tool-group/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: toolGroupSchemas.update }),
    outputSchema: t.Array(toolGroupSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: ToolGroupSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(toolGroup)
        .set(input.data as Partial<ToolGroupInsert>)
        .where(eq(toolGroup.id, id))
        .returning();
      if (result) results.push(result as ToolGroupSelect);
    }
    return results;
  },
});
