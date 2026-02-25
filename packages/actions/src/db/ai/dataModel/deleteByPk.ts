/**
 * 删除数据模型
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dataModel } from '@qiyu-allinai/db/entities/ai';

export const dataModelDeleteByPk = defineAction({
  meta: {
    name: 'ai.dataModel.deleteByPk',
    displayName: '删除数据模型',
    description: `根据ID删除单个数据模型（物理删除）。

**路径参数：**
- id: 数据模型的UUID

**返回：**
- true: 删除成功
- false: 未找到或删除失败`,
    tags: ['ai', 'dataModel'],
    method: 'DELETE',
    path: '/api/ai/data-model/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(dataModel).where(eq(dataModel.id, input.id)).returning();
    return !!result;
  },
});
