/**
 * 重置用户密码
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { user } from '@qiyu-allinai/db/entities/system';
import { checkIsSystemAdmin, hashPassword, generateSalt, getInitPassword } from './utils';

export const userResetPassword = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.user.resetPassword',
    displayName: '重置密码',
    description: '重置用户密码为初始密码',
    tags: ['system', 'user'],
    method: 'POST',
    path: '/api/system/user/:id/reset-password',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查是否是系统管理员
    if (await checkIsSystemAdmin(db, input.id)) {
      throw ActionError.forbidden('error.system.admin.cannot.modify');
    }
    
    // 获取目标用户的部门ID
    const [targetUser] = await db.select({ deptId: user.deptId })
      .from(user)
      .where(and(eq(user.id, input.id), isNull(user.deletedAt)))
      .limit(1);
    
    if (!targetUser) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.USER, targetUser.deptId);
    
    // 获取初始密码
    const initPassword = await getInitPassword(db);
    
    // 生成新的盐值和哈希密码
    const salt = generateSalt();
    const hashedPassword = await hashPassword(initPassword, salt);
    
    // 更新用户密码
    const [result] = await db.update(user).set({
      salt,
      password: hashedPassword,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    }).where(and(eq(user.id, input.id), isNull(user.deletedAt))).returning();
    
    return { success: !!result };
  },
});
