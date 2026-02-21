/**
 * 根据ID查询AI模型
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { model } from '@qiyu-allinai/db/entities/ai';
import { modelZodSchemas } from './schemas';
import type { ModelSelect } from './utils';

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
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: modelZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(model).where(eq(model.id, input.id)).limit(1);
    return (result as ModelSelect) ?? null;
  },
});
