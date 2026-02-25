/**
 * 更新数据模型
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dataModel, dataModelSchemas } from '@qiyu-allinai/db/entities/ai';
import type { DataModelSelect, DataModelInsert } from '@qiyu-allinai/db/entities/ai/dataModel';

export const dataModelUpdate = defineAction({
  meta: {
    name: 'ai.dataModel.update',
    displayName: '更新数据模型',
    description: `根据ID更新单个数据模型的信息。

**路径参数：**
- id: 数据模型的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- name: 模型名称
- description: 描述
- jsonSchema: JSON Schema 定义
- status: 状态，"0"=启用，"1"=禁用
- remark: 备注`,
    tags: ['ai', 'dataModel'],
    method: 'PUT',
    path: '/api/ai/data-model/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: dataModelSchemas.update }),
    outputSchema: dataModelSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(dataModel)
      .set(input.data as Partial<DataModelInsert>)
      .where(eq(dataModel.id, input.id))
      .returning();
    return result as DataModelSelect;
  },
});
