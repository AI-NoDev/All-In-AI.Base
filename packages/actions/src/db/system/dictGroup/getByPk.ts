/**
 * 根据Key查询字典组
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dictGroup, dictGroupSchemas } from '@qiyu-allinai/db/entities/system';
import type { DictGroupSelect } from '@qiyu-allinai/db/entities/system/dictGroup';

export const dictGroupGetByPk = defineAction({
  meta: {
    name: 'system.dictGroup.getByPk',
    displayName: '根据Key查询字典组',
    description: `根据主键Key查询单个字典组详情。

**参数说明：**
- key: 字典组的唯一键，如 "sys_user_sex"、"sys_normal_disable"

**返回值：**
- 成功：返回字典组完整信息（key, name, status, remark等）
- 未找到：返回 null`,
    tags: ['system', 'dictGroup'],
    method: 'GET',
    path: '/api/system/dict-group/:key',
  },
  schemas: {
    paramsSchema: t.Object({ key: t.String({ minLength: 1, maxLength: 100 }) }),
    outputSchema: t.Union([dictGroupSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(dictGroup).where(eq(dictGroup.key, input.key)).limit(1);
    return (result as DictGroupSelect) ?? null;
  },
});
