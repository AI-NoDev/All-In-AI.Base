/**
 * 根据ID查询工作流
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { workflow, workflowSchemas } from '@qiyu-allinai/db/entities/ai';
import type { WorkflowSelect } from '@qiyu-allinai/db/entities/ai/workflow';

export const workflowGetByPk = defineAction({
  meta: {
    name: 'ai.workflow.getByPk',
    displayName: '根据ID查询工作流',
    description: `根据主键ID查询单个工作流的详细信息。

**路径参数：**
- id: 工作流的UUID

**返回：**
- 找到时返回完整的工作流对象（包含 graph 定义）
- 未找到时返回 null`,
    tags: ['ai', 'workflow'],
    method: 'GET',
    path: '/api/ai/workflow/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([workflowSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(workflow).where(eq(workflow.id, input.id)).limit(1);
    return (result as WorkflowSelect) ?? null;
  },
});
