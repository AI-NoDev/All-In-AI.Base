/**
 * 批量创建字典组
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { dictGroup, dictGroupSchemas } from '@qiyu-allinai/db/entities/system';
import type { DictGroupSelect, DictGroupInsert } from '@qiyu-allinai/db/entities/system/dictGroup';

export const dictGroupCreateMany = defineAction({
  meta: {
    name: 'system.dictGroup.createMany',
    ignoreTools: true,
    displayName: '批量创建字典组',
    description: `批量创建多个字典组记录。

**参数说明：**
- data: 字典组数组，每个元素包含 key、name 等字段`,
    tags: ['system', 'dictGroup'],
    method: 'POST',
    path: '/api/system/dict-group/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(dictGroupSchemas.insert) }),
    outputSchema: t.Array(dictGroupSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(dictGroup).values(input.data as DictGroupInsert[]).returning();
    return results as DictGroupSelect[];
  },
});
