/**
 * 创建工作流
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { workflow, workflowSchemas } from '@qiyu-allinai/db/entities/ai';
import type { WorkflowSelect, WorkflowInsert } from '@qiyu-allinai/db/entities/ai/workflow';

export const workflowCreate = defineAction({
  meta: {
    name: 'ai.workflow.create',
    displayName: '创建工作流',
    description: `创建单个工作流。

**必填字段：**
- name: 工作流名称

**可选字段：**
- description: 描述
- icon: 图标 iconify ,例如：mdi:robot
- graph: 工作流图定义（默认空图）
- status: 状态，"0"=草稿（默认），"1"=已发布，"2"=已禁用
- remark: 备注

**示例：**
\`\`\`json
{
  "data": {
    "name": "客服工作流",
    "description": "自动回复客户问题",
    "graph": {
      "nodes": [
        { "id": "start", "type": "start", "position": { "x": 0, "y": 0 }, "data": {} },
        { "id": "llm", "type": "llm", "position": { "x": 200, "y": 0 }, "data": { "model": "gpt-4" } },
        { "id": "end", "type": "end", "position": { "x": 400, "y": 0 }, "data": {} }
      ],
      "edges": [
        { "id": "e1", "source": "start", "target": "llm" },
        { "id": "e2", "source": "llm", "target": "end" }
      ]
    }
  }
}
\`\`\``,
    tags: ['ai', 'workflow'],
    method: 'POST',
    path: '/api/ai/workflow',
  },
  schemas: {
    bodySchema: t.Object({ data: workflowSchemas.insert }),
    outputSchema: workflowSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(workflow).values(input.data as WorkflowInsert).returning();
    return result as WorkflowSelect;
  },
});
