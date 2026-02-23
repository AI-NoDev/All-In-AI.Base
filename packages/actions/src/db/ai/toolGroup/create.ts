/**
 * 创建工具组
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toolGroup, toolGroupSchemas } from '@qiyu-allinai/db/entities/ai';
import type { ToolGroupSelect, ToolGroupInsert } from '@qiyu-allinai/db/entities/ai/toolGroup';

export const toolGroupCreate = defineAction({
  meta: {
    name: 'ai.toolGroup.create',
    displayName: '创建工具组',
    description: `创建单个工具组记录。

**必填字段：**
- name: 工具组名称

**可选字段：**
- description: 描述
- icon: 图标
- orderNum: 排序号
- status: 状态

**示例：**
\`\`\`json
{
  "data": {
    "name": "代码工具",
    "description": "代码相关的AI工具",
    "orderNum": 1
  }
}
\`\`\``,
    tags: ['ai', 'toolGroup'],
    method: 'POST',
    path: '/api/ai/tool-group',
  },
  schemas: {
    bodySchema: t.Object({ data: toolGroupSchemas.insert }),
    outputSchema: toolGroupSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(toolGroup).values(input.data as ToolGroupInsert).returning();
    return result as ToolGroupSelect;
  },
});
