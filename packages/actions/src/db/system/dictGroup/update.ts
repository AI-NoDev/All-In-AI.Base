/**
 * 更新字典组
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dictGroup, dictGroupSchemas } from '@qiyu-allinai/db/entities/system';
import type { DictGroupSelect, DictGroupInsert } from '@qiyu-allinai/db/entities/system/dictGroup';

export const dictGroupUpdate = defineAction({
  meta: {
    name: 'system.dictGroup.update',
    displayName: '更新字典组',
    description: `根据Key更新单个字典组信息。

**路径参数：**
- key: 字典组键

**可更新字段：**
- name: 字典组名称
- status: 状态，"0"=正常，"1"=禁用
- remark: 备注`,
    tags: ['system', 'dictGroup'],
    method: 'PUT',
    path: '/api/system/dict-group/:key',
  },
  schemas: {
    paramsSchema: t.Object({ key: t.String({ minLength: 1, maxLength: 100 }) }),
    bodySchema: t.Object({ data: dictGroupSchemas.update }),
    outputSchema: dictGroupSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(dictGroup)
      .set(input.data as Partial<DictGroupInsert>)
      .where(eq(dictGroup.key, input.key))
      .returning();
    return result as DictGroupSelect;
  },
});
