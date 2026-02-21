/**
 * 创建字典组
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { dictGroup } from '@qiyu-allinai/db/entities/system';
import { dictGroupZodSchemas } from './schemas';
import type { DictGroupSelect, DictGroupInsert } from './utils';

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
- remark: 备注说明

**键命名规范：**
- 使用下划线分隔：module_entity_field
- 系统字典：sys_*
- 业务字典：biz_*

**使用场景：**
1. 添加新的字典分类
2. 系统初始化时创建默认字典组

**示例：**
\`\`\`json
{
  "data": {
    "key": "sys_user_sex",
    "name": "用户性别",
    "status": "0",
    "remark": "用户性别选项"
  }
}
\`\`\``,
    tags: ['system', 'dictGroup'],
    method: 'POST',
    path: '/api/system/dict-group',
  },
  schemas: {
    bodySchema: z.object({ data: dictGroupZodSchemas.insert }),
    outputSchema: dictGroupZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(dictGroup).values(input.data as DictGroupInsert).returning();
    return result as DictGroupSelect;
  },
});
