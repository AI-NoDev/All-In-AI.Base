/**
 * 设置用户的角色列表（全量替换）
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userRole } from '@qiyu-allinai/db/entities/system';
import type { UserRoleInsert } from './utils';

export const userRoleSetByUserId = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userRole.setByUserId',
    displayName: '设置用户角色',
    description: `设置指定用户的角色列表，采用全量替换方式。

**路径参数：**
- userId: 用户UUID，必填

**请求体参数：**
- roleIds: 角色ID数组，必填，可为空数组（清空所有角色）

**操作逻辑：**
1. 删除该用户的所有现有角色关联
2. 插入新的角色关联列表

**使用场景：**
- 用户编辑页面，保存用户的角色配置
- 批量更新用户的角色权限

**示例：**
PUT /api/system/user-role/user/550e8400-e29b-41d4-a716-446655440000
\`\`\`json
{
  "roleIds": ["role-id-1", "role-id-2", "role-id-3"]
}
\`\`\`

**清空角色：**
\`\`\`json
{
  "roleIds": []
}
\`\`\``,
    tags: ['system', 'userRole'],
    method: 'PUT',
    path: '/api/system/user-role/user/:userId',
  },
  schemas: {
    paramsSchema: z.object({ userId: z.string() }),
    bodySchema: z.object({ roleIds: z.array(z.string()) }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 删除该用户的所有角色关联
    await db.delete(userRole).where(eq(userRole.userId, input.userId));

    // 插入新的角色关联
    if (input.roleIds.length > 0) {
      const newRecords: UserRoleInsert[] = input.roleIds.map(roleId => ({
        userId: input.userId,
        roleId,
      }));
      await db.insert(userRole).values(newRecords);
    }

    return true;
  },
});
