/**
 * 创建用户角色关联
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { userRole } from '@qiyu-allinai/db/entities/system';
import { userRoleZodSchemas } from './schemas';
import type { UserRoleSelect, UserRoleInsert } from './utils';

export const userRoleCreate = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userRole.create',
    displayName: '创建用户角色关联',
    description: `创建单个用户与角色的关联关系。

**请求体参数 (data)：**
- userId: 用户UUID，必填
- roleId: 角色UUID，必填

**使用场景：**
- 为用户分配单个角色
- 动态添加用户权限

**示例：**
\`\`\`json
{
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "roleId": "550e8400-e29b-41d4-a716-446655440002"
  }
}
\`\`\``,
    tags: ['system', 'userRole'],
    method: 'POST',
    path: '/api/system/user-role',
  },
  schemas: {
    bodySchema: z.object({ data: userRoleZodSchemas.insert }),
    outputSchema: userRoleZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(userRole).values(input.data as UserRoleInsert).returning();
    return result as UserRoleSelect;
  },
});
