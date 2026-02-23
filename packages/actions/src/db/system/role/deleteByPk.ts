/**
 * 删除角色
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { role } from '@qiyu-allinai/db/entities/system';
import { checkIsAdminRole } from './utils';

export const roleDeleteByPk = defineAction({
  meta: {
    name: 'system.role.deleteByPk',
    displayName: '删除角色',
    description: `根据ID软删除角色。

**路径参数：**
- id: 角色的UUID

**注意事项：**
- 管理员角色（key=admin）不允许删除
- 软删除，数据保留但标记为已删除

**返回：**
- true: 删除成功
- false: 未找到或删除失败

**示例：**
DELETE /api/system/role/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'role'],
    method: 'DELETE',
    path: '/api/system/role/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    
    if (await checkIsAdminRole(db, input.id)) {
      throw ActionError.forbidden('error.system.adminRole.cannot.delete');
    }
    
    const [result] = await db.update(role)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: currentUserId,
        deletedBy: currentUserName,
      })
      .where(and(eq(role.id, input.id), isNull(role.deletedAt)))
      .returning();
    return !!result;
  },
});
