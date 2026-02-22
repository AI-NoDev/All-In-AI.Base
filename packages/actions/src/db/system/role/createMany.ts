/**
 * 批量创建角色
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { role } from '@qiyu-allinai/db/entities/system';
import { roleZodSchemas } from './schemas';
import type { RoleSelect, RoleInsert } from './utils';

export const roleCreateMany = defineAction({
  meta: {
    name: 'system.role.createMany',
    ignoreTools: true,
    displayName: '批量创建角色',
    description: `批量创建多个角色，适用于初始化场景。

**请求体：**
- data: 角色对象数组

**示例：**
\`\`\`json
{
  "data": [
    { "name": "管理员", "key": "admin" },
    { "name": "普通用户", "key": "user" }
  ]
}
\`\`\`

**返回：** 创建成功的角色对象数组`,
    tags: ['system', 'role'],
    method: 'POST',
    path: '/api/system/role/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(roleZodSchemas.insert) }),
    outputSchema: z.array(roleZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(role).values(input.data as RoleInsert[]).returning();
    return results as RoleSelect[];
  },
});
