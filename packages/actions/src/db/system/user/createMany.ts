/**
 * 批量创建用户
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { user, userSchemas } from '@qiyu-allinai/db/entities/system';
import { hashPassword, generateSalt, sanitizeUser, type UserSelect, type UserInsert } from './utils';

export const userCreateMany = defineAction({
  meta: {
    name: 'system.user.createMany',
    ignoreTools: true,
    displayName: '批量创建用户',
    description: '批量创建多个用户',
    tags: ['system', 'user'],
    method: 'POST',
    path: '/api/system/user/batch',
  },
  schemas: {
    bodySchema: t.Object({ 
      data: t.Array(t.Object({
        user: userSchemas.insert,
        password: t.String({ minLength: 6, maxLength: 50 }),
      })),
    }),
    outputSchema: t.Array(userSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.USER);
    
    const usersToInsert: UserInsert[] = [];
    
    for (const item of input.data) {
      const salt = generateSalt();
      const hashedPassword = await hashPassword(item.password, salt);
      usersToInsert.push({
        ...item.user,
        salt,
        password: hashedPassword,
      } as UserInsert);
    }
    
    const results = await db.insert(user).values(usersToInsert).returning();
    return results.map(sanitizeUser) as UserSelect[];
  },
});
