/**
 * 创建字典
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { dict } from '@qiyu-allinai/db/entities/system';
import { dictZodSchemas } from './schemas';
import type { DictSelect, DictInsert } from './utils';

export const dictCreate = defineAction({
  meta: {
    name: 'system.dict.create',
    displayName: '创建字典',
    description: `创建单个字典项。

**必填字段：**
- group: 字典分组（如 sys_user_status）
- label: 显示标签
- value: 字典值

**可选字段：**
- status: 状态，"0"=正常（默认），"1"=禁用
- isDefault: 是否默认值，默认false
- sort: 排序号，默认0
- remark: 备注

**示例：**
\`\`\`json
{
  "data": {
    "group": "sys_user_status",
    "label": "正常",
    "value": "0",
    "isDefault": true,
    "sort": 1
  }
}
\`\`\``,
    tags: ['system', 'dict'],
    method: 'POST',
    path: '/api/system/dict',
  },
  schemas: {
    bodySchema: z.object({ data: dictZodSchemas.insert }),
    outputSchema: dictZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(dict).values(input.data as DictInsert).returning();
    return result as DictSelect;
  },
});
