/**
 * 创建数据模型
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { dataModel, dataModelSchemas } from '@qiyu-allinai/db/entities/ai';
import type { DataModelSelect, DataModelInsert } from '@qiyu-allinai/db/entities/ai/dataModel';

export const dataModelCreate = defineAction({
  meta: {
    name: 'ai.dataModel.create',
    displayName: '创建数据模型',
    description: `创建单个数据模型（JSON Schema）。

**必填字段：**
- name: 模型名称
- jsonSchema: JSON Schema 定义对象

**可选字段：**
- description: 描述
- status: 状态，"0"=启用（默认），"1"=禁用
- remark: 备注

**示例：**
\`\`\`json
{
  "data": {
    "name": "用户表单",
    "description": "用户信息录入表单",
    "jsonSchema": {
      "type": "object",
      "properties": {
        "name": { "type": "string", "title": "姓名" },
        "age": { "type": "number", "title": "年龄" }
      },
      "required": ["name"]
    }
  }
}
\`\`\``,
    tags: ['ai', 'dataModel'],
    method: 'POST',
    path: '/api/ai/data-model',
  },
  schemas: {
    bodySchema: t.Object({ data: dataModelSchemas.insert }),
    outputSchema: dataModelSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(dataModel).values(input.data as DataModelInsert).returning();
    return result as DataModelSelect;
  },
});
