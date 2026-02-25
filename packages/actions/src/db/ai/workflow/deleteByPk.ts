/**
 * 删除工作流
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { workflow } from '@qiyu-allinai/db/entities/ai';

export const workflowDeleteByPk = defineAction({
  meta: {
    name: 'ai.workflow.deleteByPk',
    displayName: '删除工作流',
    description: `根据ID删除单个工作流（物理删除）。

**路径参数：**
- id: 工作流的UUID

**返回：**
- true: 删除成功
- false: 未找到或删除失败`,
    tags: ['ai', 'workflow'],
    method: 'DELETE',
    path: '/api/ai/workflow/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(workflow).where(eq(workflow.id, input.id)).returning();
    return !!result;
  },
});
