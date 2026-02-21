/**
 * 批量更新工具组
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toolGroup } from '@qiyu-allinai/db/entities/ai';
import { toolGroupZodSchemas } from './schemas';
import type { ToolGroupSelect, ToolGroupInsert } from './utils';

export const toolGroupUpdateMany = defineAction({
  meta: {
    name: 'ai.toolGroup.updateMany',
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
    bodySchema: z.object({ ids: z.array(z.string()), data: toolGroupZodSchemas.update }),
    outputSchema: z.array(toolGroupZodSchemas.select),
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
