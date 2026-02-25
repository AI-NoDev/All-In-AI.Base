/**
 * 批量创建工作流
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { workflow, workflowSchemas } from '@qiyu-allinai/db/entities/ai';
import type { WorkflowSelect, WorkflowInsert } from '@qiyu-allinai/db/entities/ai/workflow';

export const workflowCreateMany = defineAction({
  meta: {
    name: 'ai.workflow.createMany',
    ignoreTools: true,
    displayName: '批量创建工作流',
    description: `批量创建多个工作流，适用于初始化或导入场景。

**请求体：**
- data: 工作流对象数组

**返回：** 创建成功的工作流对象数组`,
    tags: ['ai', 'workflow'],
    method: 'POST',
    path: '/api/ai/workflow/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(workflowSchemas.insert) }),
    outputSchema: t.Array(workflowSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(workflow).values(input.data as WorkflowInsert[]).returning();
    return results as WorkflowSelect[];
  },
});
