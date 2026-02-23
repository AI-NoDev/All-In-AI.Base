/**
 * 创建字典组
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { dictGroup, dictGroupSchemas } from '@qiyu-allinai/db/entities/system';
import type { DictGroupSelect, DictGroupInsert } from '@qiyu-allinai/db/entities/system/dictGroup';

export const dictGroupCreate = defineAction({
  meta: {
    name: 'system.dictGroup.create',
    displayName: '创建字典组',
    description: `创建单个字典组记录。

**必填字段：**
- key: 字典组键，唯一标识，如 "sys_user_sex"
- name: 字典组名称，如 "用户性别"

**可选字段：**
- status: 状态，"0"=正常（默认），"1"=禁用
- remark: 备注说明`,
    tags: ['system', 'dictGroup'],
    method: 'POST',
    path: '/api/system/dict-group',
  },
  schemas: {
    bodySchema: t.Object({ data: dictGroupSchemas.insert }),
    outputSchema: dictGroupSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(dictGroup).values(input.data as DictGroupInsert).returning();
    return result as DictGroupSelect;
  },
});
