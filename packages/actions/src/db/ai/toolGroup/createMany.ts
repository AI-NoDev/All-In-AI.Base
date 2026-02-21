/**
 * 批量创建工具组
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toolGroup } from '@qiyu-allinai/db/entities/ai';
import { toolGroupZodSchemas } from './schemas';
import type { ToolGroupSelect, ToolGroupInsert } from './utils';

export const toolGroupCreateMany = defineAction({
  meta: {
    name: 'ai.toolGroup.createMany',
    displayName: '批量创建工具组',
    description: `批量创建多个工具组记录。

**示例：**
\`\`\`json
{
  "data": [
    { "name": "代码工具", "orderNum": 1 },
    { "name": "文档工具", "orderNum": 2 }
  ]
}
\`\`\``,
    tags: ['ai', 'toolGroup'],
    method: 'POST',
    path: '/api/ai/tool-group/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(toolGroupZodSchemas.insert) }),
    outputSchema: z.array(toolGroupZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(toolGroup).values(input.data as ToolGroupInsert[]).returning();
    return results as ToolGroupSelect[];
  },
});
