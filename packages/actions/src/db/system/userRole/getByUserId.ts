/**
 * 获取用户的角色ID列表
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userRole } from '@qiyu-allinai/db/entities/system';

export const userRoleGetByUserId = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userRole.getByUserId',
    displayName: '获取用户角色',
    description: `获取指定用户的所有角色ID列表。

**路径参数：**
- userId: 用户UUID，必填

**返回：**
- 角色ID数组，如 ["role-id-1", "role-id-2", "role-id-3"]

**使用场景：**
- 用户详情页面，显示用户所属角色
- 用户编辑页面，获取当前用户已分配的角色
- 权限判断，检查用户是否拥有某角色
- 用户登录后获取角色列表

**示例：**
GET /api/system/user-role/user/550e8400-e29b-41d4-a716-446655440000

**返回示例：**
\`\`\`json
["role-id-1", "role-id-2", "role-id-3"]
\`\`\``,
    tags: ['system', 'userRole'],
    method: 'GET',
    path: '/api/system/user-role/user/:userId',
  },
  schemas: {
    paramsSchema: t.Object({ userId: t.String() }),
    outputSchema: t.Array(t.String()),
  },
  execute: async (input, context) => {
    const { db } = context;
    const data = await db.select({ roleId: userRole.roleId }).from(userRole).where(eq(userRole.userId, input.userId));
    return data.map(d => d.roleId);
  },
});
