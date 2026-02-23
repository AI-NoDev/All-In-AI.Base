/**
 * 根据ID查询AI模型
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { model, modelSchemas } from '@qiyu-allinai/db/entities/ai';
import type { ModelSelect } from '@qiyu-allinai/db/entities/ai/model';

export const modelGetByPk = defineAction({
  meta: {
    name: 'ai.model.getByPk',
    displayName: '根据ID查询AI模型',
    description: `根据主键ID查询单个AI模型的详细信息。

**路径参数：**
- id: 模型的UUID

**返回：**
- 找到时返回完整的模型对象
- 未找到时返回 null

**示例：**
GET /api/ai/model/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'model'],
    method: 'GET',
    path: '/api/ai/model/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([modelSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(model).where(eq(model.id, input.id)).limit(1);
    return (result as ModelSelect) ?? null;
  },
});
