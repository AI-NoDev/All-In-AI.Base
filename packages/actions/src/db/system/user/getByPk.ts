/**
 * 根据ID查询用户
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { user, userSchemas } from '@qiyu-allinai/db/entities/system';
import { sanitizeUser, type UserSelect } from './utils';

export const userGetByPk = defineAction({
  meta: {
    name: 'system.user.getByPk',
    displayName: '根据ID查询用户',
    description: '根据主键ID查询单个用户',
    tags: ['system', 'user'],
    method: 'GET',
    path: '/api/system/user/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([userSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(user)
      .where(and(eq(user.id, input.id), isNull(user.deletedAt)))
      .limit(1);
    return result ? sanitizeUser(result) as UserSelect : null;
  },
});
