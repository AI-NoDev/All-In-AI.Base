/**
 * 更新字典组
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dictGroup } from '@qiyu-allinai/db/entities/system';
import { dictGroupZodSchemas } from './schemas';
import type { DictGroupSelect, DictGroupInsert } from './utils';

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
- remark: 备注

**注意事项：**
- key 作为主键不可修改
- 禁用字典组会影响使用该字典的功能

**示例：**
\`\`\`json
// PUT /api/system/dict-group/sys_user_sex
{
  "data": {
    "name": "性别",
    "status": "0"
  }
}
\`\`\``,
    tags: ['system', 'dictGroup'],
    method: 'PUT',
    path: '/api/system/dict-group/:key',
  },
  schemas: {
    paramsSchema: z.object({ key: z.string().min(1).max(100) }),
    bodySchema: z.object({ data: dictGroupZodSchemas.update }),
    outputSchema: dictGroupZodSchemas.select,
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
