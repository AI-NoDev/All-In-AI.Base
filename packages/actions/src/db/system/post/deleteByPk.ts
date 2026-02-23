/**
 * 删除岗位
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post } from '@qiyu-allinai/db/entities/system';

export const postDeleteByPk = defineAction({
  meta: {
    name: 'system.post.deleteByPk',
    displayName: '删除岗位',
    description: '根据ID软删除岗位（逻辑删除，数据保留）',
    tags: ['system', 'post'],
    method: 'DELETE',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(post)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(eq(post.id, input.id), isNull(post.deletedAt)))
      .returning();
    return !!result;
  },
});
