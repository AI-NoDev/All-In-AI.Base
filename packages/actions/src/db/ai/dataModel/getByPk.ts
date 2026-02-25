/**
 * 根据ID查询数据模型
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dataModel, dataModelSchemas } from '@qiyu-allinai/db/entities/ai';
import type { DataModelSelect } from '@qiyu-allinai/db/entities/ai/dataModel';

export const dataModelGetByPk = defineAction({
  meta: {
    name: 'ai.dataModel.getByPk',
    displayName: '根据ID查询数据模型',
    description: `根据主键ID查询单个数据模型的详细信息。

**路径参数：**
- id: 数据模型的UUID

**返回：**
- 找到时返回完整的数据模型对象
- 未找到时返回 null`,
    tags: ['ai', 'dataModel'],
    method: 'GET',
    path: '/api/ai/data-model/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([dataModelSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(dataModel).where(eq(dataModel.id, input.id)).limit(1);
    return (result as DataModelSelect) ?? null;
  },
});
