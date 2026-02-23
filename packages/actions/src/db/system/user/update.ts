/**
 * 更新用户
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { user, userSchemas, userRole, userPost } from '@qiyu-allinai/db/entities/system';
import { checkIsSystemAdmin, sanitizeUser, type UserSelect, type UserInsert } from './utils';

// 更新用户的输入 schema
const updateUserBodySchema = t.Object({
  data: t.Composite([
    userSchemas.update,
    t.Object({
      roleIds: t.Optional(t.Union([t.Array(t.String()), t.Null()])),
      postIds: t.Optional(t.Union([t.Array(t.String()), t.Null()])),
    }),
  ]),
});

export const userUpdate = defineAction({
  meta: {
    name: 'system.user.update',
    displayName: '更新用户',
    description: '根据ID更新单个用户',
    tags: ['system', 'user'],
    method: 'PUT',
    path: '/api/system/user/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: updateUserBodySchema,
    outputSchema: userSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { roleIds, postIds, ...userData } = input.data;
    
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
    
    const [result] = await db.update(user)
      .set(userData as Partial<UserInsert>)
      .where(and(eq(user.id, input.id), isNull(user.deletedAt)))
      .returning();
    
    if (!result) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    // 处理角色关联（如果传入了 roleIds）
    if (roleIds !== undefined) {
      await db.delete(userRole).where(eq(userRole.userId, input.id));
      if (roleIds && roleIds.length > 0) {
        const roleRecords = roleIds.map(roleId => ({
          userId: input.id,
          roleId,
        }));
        await db.insert(userRole).values(roleRecords);
      }
    }
    
    // 处理岗位关联（如果传入了 postIds）
    if (postIds !== undefined) {
      await db.delete(userPost).where(eq(userPost.userId, input.id));
      if (postIds && postIds.length > 0) {
        const postRecords = postIds.map(postId => ({
          userId: input.id,
          postId,
        }));
        await db.insert(userPost).values(postRecords);
      }
    }
    
    return sanitizeUser(result) as UserSelect;
  },
});
