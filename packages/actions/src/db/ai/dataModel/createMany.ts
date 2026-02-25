/**
 * 批量创建数据模型
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { dataModel, dataModelSchemas } from '@qiyu-allinai/db/entities/ai';
import type { DataModelSelect, DataModelInsert } from '@qiyu-allinai/db/entities/ai/dataModel';

export const dataModelCreateMany = defineAction({
  meta: {
    name: 'ai.dataModel.createMany',
    ignoreTools: true,
    displayName: '批量创建数据模型',
    description: `批量创建多个数据模型，适用于初始化场景。

**请求体：**
- data: 数据模型对象数组

**返回：** 创建成功的数据模型对象数组`,
    tags: ['ai', 'dataModel'],
    method: 'POST',
    path: '/api/ai/data-model/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(dataModelSchemas.insert) }),
    outputSchema: t.Array(dataModelSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(dataModel).values(input.data as DataModelInsert[]).returning();
    return results as DataModelSelect[];
  },
});
