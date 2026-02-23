/**
 * 批量更新字典组
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dictGroup, dictGroupSchemas } from '@qiyu-allinai/db/entities/system';
import type { DictGroupSelect, DictGroupInsert } from '@qiyu-allinai/db/entities/system/dictGroup';

export const dictGroupUpdateMany = defineAction({
  meta: {
    name: 'system.dictGroup.updateMany',
    ignoreTools: true,
    displayName: '批量更新字典组',
    description: `根据Key列表批量更新字典组。

**参数说明：**
- keys: 要更新的字典组键数组
- data: 更新的字段数据`,
    tags: ['system', 'dictGroup'],
    method: 'PUT',
    path: '/api/system/dict-group/batch',
  },
  schemas: {
    bodySchema: t.Object({ keys: t.Array(t.String({ minLength: 1, maxLength: 100 })), data: dictGroupSchemas.update }),
    outputSchema: t.Array(dictGroupSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: DictGroupSelect[] = [];
    for (const key of input.keys) {
      const [result] = await db.update(dictGroup)
        .set(input.data as Partial<DictGroupInsert>)
        .where(eq(dictGroup.key, key))
        .returning();
      if (result) results.push(result as DictGroupSelect);
    }
    return results;
  },
});
