/**
 * 批量更新字典组
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dictGroup } from '@qiyu-allinai/db/entities/system';
import { dictGroupZodSchemas } from './schemas';
import type { DictGroupSelect, DictGroupInsert } from './utils';

export const dictGroupUpdateMany = defineAction({
  meta: {
    name: 'system.dictGroup.updateMany',
    ignoreTools: true,
    displayName: '批量更新字典组',
    description: `根据Key列表批量更新字典组。

**参数说明：**
- keys: 要更新的字典组键数组
- data: 更新的字段数据

**使用场景：**
1. 批量启用/禁用字典组
2. 批量添加备注

**示例：**
\`\`\`json
{
  "keys": ["sys_user_sex", "sys_normal_disable"],
  "data": {
    "status": "1",
    "remark": "已停用"
  }
}
\`\`\``,
    tags: ['system', 'dictGroup'],
    method: 'PUT',
    path: '/api/system/dict-group/batch',
  },
  schemas: {
    bodySchema: z.object({ keys: z.array(z.string().min(1).max(100)), data: dictGroupZodSchemas.update }),
    outputSchema: z.array(dictGroupZodSchemas.select),
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
