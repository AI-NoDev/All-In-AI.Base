/**
 * 批量更新工作流
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { workflow, workflowSchemas } from '@qiyu-allinai/db/entities/ai';
import type { WorkflowSelect, WorkflowInsert } from '@qiyu-allinai/db/entities/ai/workflow';

export const workflowUpdateMany = defineAction({
  meta: {
    name: 'ai.workflow.updateMany',
    ignoreTools: true,
    displayName: '批量更新工作流',
    description: `根据ID列表批量更新多个工作流。

**请求体：**
- ids: 要更新的工作流ID数组
- data: 更新数据对象

**使用场景：**
- 批量启用/禁用工作流
- 批量发布工作流

**返回：** 更新成功的工作流对象数组`,
    tags: ['ai', 'workflow'],
    method: 'PUT',
    path: '/api/ai/workflow/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: workflowSchemas.update }),
    outputSchema: t.Array(workflowSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: WorkflowSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(workflow)
        .set(input.data as Partial<WorkflowInsert>)
        .where(eq(workflow.id, id))
        .returning();
      if (result) results.push(result as WorkflowSelect);
    }
    return results;
  },
});
