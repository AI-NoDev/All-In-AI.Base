/**
 * 批量创建用户角色关联
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { userRole } from '@qiyu-allinai/db/entities/system';
import { userRoleZodSchemas } from './schemas';
import type { UserRoleSelect, UserRoleInsert } from './utils';

export const userRoleCreateMany = defineAction({
  meta: {
    name: 'system.userRole.createMany',
    displayName: '批量创建用户角色关联',
    description: `批量创建多个用户与角色的关联关系。

**请求体参数 (data)：**
- 数组，每个元素包含：
  - userId: 用户UUID，必填
  - roleId: 角色UUID，必填

**使用场景：**
- 为用户一次性分配多个角色
- 批量导入用户角色关联

**示例：**
\`\`\`json
{
  "data": [
    { "userId": "user-1", "roleId": "role-1" },
    { "userId": "user-1", "roleId": "role-2" },
    { "userId": "user-2", "roleId": "role-1" }
  ]
}
\`\`\``,
    tags: ['system', 'userRole'],
    method: 'POST',
    path: '/api/system/user-role/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(userRoleZodSchemas.insert) }),
    outputSchema: z.array(userRoleZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(userRole).values(input.data as UserRoleInsert[]).returning();
    return results as UserRoleSelect[];
  },
});
