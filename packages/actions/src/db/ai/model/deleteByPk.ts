/**
 * 删除AI模型
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { model } from '@qiyu-allinai/db/entities/ai';

export const modelDeleteByPk = defineAction({
  meta: {
    name: 'ai.model.deleteByPk',
    displayName: '删除AI模型',
    description: `根据ID删除单个AI模型（物理删除）。

**路径参数：**
- id: 模型的UUID

**注意事项：**
- 删除后无法恢复
- 如果模型正在被使用（如智能体引用），建议先禁用而非删除

**返回：**
- true: 删除成功
- false: 未找到或删除失败

**示例：**
DELETE /api/ai/model/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'model'],
    method: 'DELETE',
    path: '/api/ai/model/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(model).where(eq(model.id, input.id)).returning();
    return !!result;
  },
});
