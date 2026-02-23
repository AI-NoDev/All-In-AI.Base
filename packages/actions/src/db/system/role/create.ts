/**
 * 创建角色
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { role, roleSchemas } from '@qiyu-allinai/db/entities/system';
import type { RoleSelect, RoleInsert } from '@qiyu-allinai/db/entities/system/role';

export const roleCreate = defineAction({
  meta: {
    name: 'system.role.create',
    displayName: '创建角色',
    description: `创建单个角色。

**必填字段：**
- name: 角色名称
- key: 角色标识（唯一，如 admin, user, editor）

**可选字段：**
- status: 状态，"0"=正常（默认），"1"=禁用
- sort: 排序号，默认0
- remark: 备注

**示例：**
\`\`\`json
{
  "data": {
    "name": "编辑员",
    "key": "editor",
    "status": "0",
    "sort": 10
  }
}
\`\`\``,
    tags: ['system', 'role'],
    method: 'POST',
    path: '/api/system/role',
  },
  schemas: {
    bodySchema: t.Object({ data: roleSchemas.insert }),
    outputSchema: roleSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(role).values(input.data as RoleInsert).returning();
    return result as RoleSelect;
  },
});
