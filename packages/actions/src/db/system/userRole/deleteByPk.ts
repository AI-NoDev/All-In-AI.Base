/**
 * 删除用户角色关联
 */

import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userRole } from '@qiyu-allinai/db/entities/system';

export const userRoleDeleteByPk = defineAction({
  meta: {
    name: 'system.userRole.deleteByPk',
    displayName: '删除用户角色关联',
    description: `根据复合主键删除用户与角色的关联关系。

**路径参数：**
- userId: 用户UUID，必填
- roleId: 角色UUID，必填

**返回：**
- true: 删除成功
- false: 删除失败（关联不存在）

**示例：**
DELETE /api/system/user-role/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002`,
    tags: ['system', 'userRole'],
    method: 'DELETE',
    path: '/api/system/user-role/:userId/:roleId',
  },
  schemas: {
    paramsSchema: z.object({ userId: z.string(), roleId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(userRole)
      .where(and(eq(userRole.userId, input.userId), eq(userRole.roleId, input.roleId)))
      .returning();
    return !!result;
  },
});
