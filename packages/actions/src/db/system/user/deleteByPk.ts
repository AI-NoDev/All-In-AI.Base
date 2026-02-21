/**
 * 删除用户
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { checkManagePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { user } from '@qiyu-allinai/db/entities/system';
import { checkIsSystemAdmin } from './utils';

export const userDeleteByPk = defineAction({
  meta: {
    name: 'system.user.deleteByPk',
    displayName: '删除用户',
    description: '根据ID软删除用户',
    tags: ['system', 'user'],
    method: 'DELETE',
    path: '/api/system/user/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查是否是系统管理员
    if (await checkIsSystemAdmin(db, input.id)) {
      throw ActionError.forbidden('error.system.admin.cannot.delete');
    }
    
    // 获取目标用户的部门ID
    const [targetUser] = await db.select({ deptId: user.deptId })
      .from(user)
      .where(and(eq(user.id, input.id), isNull(user.deletedAt)))
      .limit(1);
    
    if (!targetUser) {
      return false;
    }
    
    // 检查管理权限
    await checkManagePermission(db, context, BUSINESS_MODULE.USER, targetUser.deptId);
    
    const [result] = await db.update(user).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName,
    }).where(and(eq(user.id, input.id), isNull(user.deletedAt))).returning();
    
    return !!result;
  },
});
