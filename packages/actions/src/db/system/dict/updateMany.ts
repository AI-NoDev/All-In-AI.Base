/**
 * 批量更新字典
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dict } from '@qiyu-allinai/db/entities/system';
import { dictZodSchemas } from './schemas';
import type { DictSelect, DictInsert } from './utils';

export const dictUpdateMany = defineAction({
  meta: {
    name: 'system.dict.updateMany',
    ignoreTools: true,
    displayName: '批量更新字典',
    description: `根据ID列表批量更新多个字典项。

**请求体：**
- ids: 要更新的字典ID数组
- data: 更新数据对象

**使用场景：**
- 批量启用/禁用字典项

**示例：**
\`\`\`json
{
  "ids": ["dict-id-1", "dict-id-2"],
  "data": { "status": "1" }
}
\`\`\`

**返回：** 更新成功的字典对象数组`,
    tags: ['system', 'dict'],
    method: 'PUT',
    path: '/api/system/dict/batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: dictZodSchemas.update }),
    outputSchema: z.array(dictZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: DictSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(dict)
        .set(input.data as Partial<DictInsert>)
        .where(and(eq(dict.id, id), isNull(dict.deletedAt)))
        .returning();
      if (result) results.push(result as DictSelect);
    }
    return results;
  },
});
