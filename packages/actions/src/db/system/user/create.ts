/**
 * 创建用户
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { user, userSchemas, userRole, userPost } from '@qiyu-allinai/db/entities/system';
import { hashPassword, generateSalt, getInitPassword, sanitizeUser, type UserSelect, type UserInsert } from './utils';

// 创建用户的输入 schema（扩展 insert schema）
const createUserBodySchema = t.Object({
  data: t.Composite([
    userSchemas.insert,
    t.Object({
      roleIds: t.Optional(t.Array(t.String())),
      postIds: t.Optional(t.Array(t.String())),
    }),
  ]),
});

export const userCreate = defineAction({
  meta: {
    name: 'system.user.create',
    displayName: '创建用户',
    description: '创建单个用户',
    tags: ['system', 'user'],
    method: 'POST',
    path: '/api/system/user',
  },
  schemas: {
    bodySchema: createUserBodySchema,
    outputSchema: userSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { roleIds, postIds, ...userData } = input.data;
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.USER, userData.deptId);
    
    // 生成盐值和哈希密码
    const salt = generateSalt();
    const hashedPassword = await hashPassword(await getInitPassword(db, userData.password), salt);
    
    const [result] = await db.insert(user).values({
      ...userData,
      salt,
      password: hashedPassword,
    } as UserInsert).returning();
    
    if (!result) {
      throw ActionError.badRequest('error.business.createFailed');
    }
    
    // 处理角色关联
    if (roleIds && roleIds.length > 0) {
      const roleRecords = roleIds.map(roleId => ({
        userId: result.id,
        roleId,
      }));
      await db.insert(userRole).values(roleRecords);
    }
    
    // 处理岗位关联
    if (postIds && postIds.length > 0) {
      const postRecords = postIds.map(postId => ({
        userId: result.id,
        postId,
      }));
      await db.insert(userPost).values(postRecords);
    }
    
    return sanitizeUser(result) as UserSelect;
  },
});
