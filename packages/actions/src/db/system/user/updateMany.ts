/**
 * 批量更新用户
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { user, userSchemas } from '@qiyu-allinai/db/entities/system';
import { checkIsSystemAdmin, sanitizeUser, type UserSelect, type UserInsert } from './utils';

export const userUpdateMany = defineAction({
  meta: {
    name: 'system.user.updateMany',
    ignoreTools: true,
    displayName: '批量更新用户',
    description: '根据ID列表批量更新用户',
    tags: ['system', 'user'],
    method: 'PUT',
    path: '/api/system/user/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: userSchemas.update }),
    outputSchema: t.Array(userSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.USER);
    
    // 检查是否包含系统管理员
    for (const id of input.ids) {
      if (await checkIsSystemAdmin(db, id)) {
        throw ActionError.forbidden('error.system.admin.cannot.modify');
      }
    }
    
    const results: (typeof user.$inferSelect)[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(user)
        .set(input.data as Partial<UserInsert>)
        .where(and(eq(user.id, id), isNull(user.deletedAt)))
        .returning();
      if (result) results.push(result);
    }
    return results.map(sanitizeUser) as UserSelect[];
  },
});
