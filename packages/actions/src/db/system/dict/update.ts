/**
 * 更新字典
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dict } from '@qiyu-allinai/db/entities/system';
import { dictZodSchemas } from './schemas';
import type { DictSelect, DictInsert } from './utils';

export const dictUpdate = defineAction({
  meta: {
    name: 'system.dict.update',
    displayName: '更新字典',
    description: `根据ID更新单个字典项的信息。

**路径参数：**
- id: 字典项的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- group: 字典分组
- label: 显示标签
- value: 字典值
- status: 状态
- isDefault: 是否默认值
- sort: 排序号
- remark: 备注

**示例：**
\`\`\`json
PUT /api/system/dict/xxx-uuid
{
  "data": { "label": "已启用", "sort": 1 }
}
\`\`\``,
    tags: ['system', 'dict'],
    method: 'PUT',
    path: '/api/system/dict/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: dictZodSchemas.update }),
    outputSchema: dictZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(dict)
      .set(input.data as Partial<DictInsert>)
      .where(and(eq(dict.id, input.id), isNull(dict.deletedAt)))
      .returning();
    return result as DictSelect;
  },
});
