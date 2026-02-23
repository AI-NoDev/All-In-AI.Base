/**
 * 批量创建字典
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { dict, dictSchemas } from '@qiyu-allinai/db/entities/system';
import type { DictSelect, DictInsert } from '@qiyu-allinai/db/entities/system/dict';

export const dictCreateMany = defineAction({
  meta: {
    name: 'system.dict.createMany',
    ignoreTools: true,
    displayName: '批量创建字典',
    description: `批量创建多个字典项，适用于初始化场景。

**请求体：**
- data: 字典对象数组

**示例：**
\`\`\`json
{
  "data": [
    { "group": "sys_user_status", "label": "正常", "value": "0", "sort": 1 },
    { "group": "sys_user_status", "label": "禁用", "value": "1", "sort": 2 }
  ]
}
\`\`\`

**返回：** 创建成功的字典对象数组`,
    tags: ['system', 'dict'],
    method: 'POST',
    path: '/api/system/dict/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(dictSchemas.insert) }),
    outputSchema: t.Array(dictSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(dict).values(input.data as DictInsert[]).returning();
    return results as DictSelect[];
  },
});
