/**
 * 批量创建字典组
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { dictGroup } from '@qiyu-allinai/db/entities/system';
import { dictGroupZodSchemas } from './schemas';
import type { DictGroupSelect, DictGroupInsert } from './utils';

export const dictGroupCreateMany = defineAction({
  meta: {
    name: 'system.dictGroup.createMany',
    displayName: '批量创建字典组',
    description: `批量创建多个字典组记录。

**参数说明：**
- data: 字典组数组，每个元素包含 key、name 等字段

**使用场景：**
1. 系统初始化时批量创建默认字典组
2. 导入字典配置

**示例：**
\`\`\`json
{
  "data": [
    { "key": "sys_user_sex", "name": "用户性别" },
    { "key": "sys_normal_disable", "name": "状态" },
    { "key": "sys_yes_no", "name": "是否" }
  ]
}
\`\`\``,
    tags: ['system', 'dictGroup'],
    method: 'POST',
    path: '/api/system/dict-group/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(dictGroupZodSchemas.insert) }),
    outputSchema: z.array(dictGroupZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(dictGroup).values(input.data as DictGroupInsert[]).returning();
    return results as DictGroupSelect[];
  },
});
