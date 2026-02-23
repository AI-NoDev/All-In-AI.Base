/**
 * 更新工具组
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toolGroup, toolGroupSchemas } from '@qiyu-allinai/db/entities/ai';
import type { ToolGroupSelect, ToolGroupInsert } from '@qiyu-allinai/db/entities/ai/toolGroup';

export const toolGroupUpdate = defineAction({
  meta: {
    name: 'ai.toolGroup.update',
    displayName: '更新工具组',
    description: `根据ID更新单个工具组信息。

**路径参数：**
- id: 工具组UUID

**示例：**
\`\`\`json
// PUT /api/ai/tool-group/xxx
{
  "data": {
    "name": "代码工具（更新）",
    "orderNum": 2
  }
}
\`\`\``,
    tags: ['ai', 'toolGroup'],
    method: 'PUT',
    path: '/api/ai/tool-group/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: toolGroupSchemas.update }),
    outputSchema: toolGroupSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(toolGroup)
      .set(input.data as Partial<ToolGroupInsert>)
      .where(eq(toolGroup.id, input.id))
      .returning();
    return result as ToolGroupSelect;
  },
});
