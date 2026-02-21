/**
 * 根据复合主键查询用户角色关联
 */

import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userRole } from '@qiyu-allinai/db/entities/system';
import { userRoleZodSchemas } from './schemas';
import type { UserRoleSelect } from './utils';

export const userRoleGetByPk = defineAction({
  meta: {
    name: 'system.userRole.getByPk',
    displayName: '根据复合主键查询用户角色关联',
    description: `根据用户ID和角色ID的复合主键查询关联记录。

**路径参数：**
- userId: 用户UUID，必填
- roleId: 角色UUID，必填

**返回：**
- 成功：返回关联对象 { userId, roleId }
- 未找到：返回 null

**示例：**
GET /api/system/user-role/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002`,
    tags: ['system', 'userRole'],
    method: 'GET',
    path: '/api/system/user-role/:userId/:roleId',
  },
  schemas: {
    paramsSchema: z.object({ userId: z.string(), roleId: z.string() }),
    outputSchema: userRoleZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(userRole)
      .where(and(eq(userRole.userId, input.userId), eq(userRole.roleId, input.roleId)))
      .limit(1);
    return (result as UserRoleSelect) ?? null;
  },
});
