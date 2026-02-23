/**
 * 删除字典组
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dictGroup } from '@qiyu-allinai/db/entities/system';

export const dictGroupDeleteByPk = defineAction({
  meta: {
    name: 'system.dictGroup.deleteByPk',
    displayName: '删除字典组',
    description: `根据Key物理删除字典组（永久删除，不可恢复）。

**参数说明：**
- key: 字典组键

**返回值：**
- true: 删除成功
- false: 字典组不存在`,
    tags: ['system', 'dictGroup'],
    method: 'DELETE',
    path: '/api/system/dict-group/:key',
  },
  schemas: {
    paramsSchema: t.Object({ key: t.String({ minLength: 1, maxLength: 100 }) }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(dictGroup).where(eq(dictGroup.key, input.key)).returning();
    return !!result;
  },
});
