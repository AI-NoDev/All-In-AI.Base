/**
 * 批量更新数据模型
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dataModel, dataModelSchemas } from '@qiyu-allinai/db/entities/ai';
import type { DataModelSelect, DataModelInsert } from '@qiyu-allinai/db/entities/ai/dataModel';

export const dataModelUpdateMany = defineAction({
  meta: {
    name: 'ai.dataModel.updateMany',
    ignoreTools: true,
    displayName: '批量更新数据模型',
    description: `根据ID列表批量更新多个数据模型。

**请求体：**
- ids: 要更新的数据模型ID数组
- data: 更新数据对象

**使用场景：**
- 批量启用/禁用数据模型

**返回：** 更新成功的数据模型对象数组`,
    tags: ['ai', 'dataModel'],
    method: 'PUT',
    path: '/api/ai/data-model/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: dataModelSchemas.update }),
    outputSchema: t.Array(dataModelSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: DataModelSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(dataModel)
        .set(input.data as Partial<DataModelInsert>)
        .where(eq(dataModel.id, id))
        .returning();
      if (result) results.push(result as DataModelSelect);
    }
    return results;
  },
});
