/**
 * 更新工作流
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { workflow, workflowSchemas } from '@qiyu-allinai/db/entities/ai';
import type { WorkflowSelect, WorkflowInsert } from '@qiyu-allinai/db/entities/ai/workflow';

export const workflowUpdate = defineAction({
  meta: {
    name: 'ai.workflow.update',
    displayName: '更新工作流',
    description: `根据ID更新单个工作流的信息。

**路径参数：**
- id: 工作流的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- name: 工作流名称
- description: 描述
- icon: 图标
- graph: 工作流图定义
- version: 版本号（通常自动递增）
- publishedVersion: 已发布版本号
- status: 状态，"0"=草稿，"1"=已发布，"2"=已禁用
- remark: 备注`,
    tags: ['ai', 'workflow'],
    method: 'PUT',
    path: '/api/ai/workflow/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: workflowSchemas.update }),
    outputSchema: workflowSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(workflow)
      .set(input.data as Partial<WorkflowInsert>)
      .where(eq(workflow.id, input.id))
      .returning();
    return result as WorkflowSelect;
  },
});
