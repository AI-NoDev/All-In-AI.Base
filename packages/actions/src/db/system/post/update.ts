/**
 * 更新岗位
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post, postSchemas } from '@qiyu-allinai/db/entities/system';
import type { PostSelect, PostInsert } from '@qiyu-allinai/db/entities/system/post';

export const postUpdate = defineAction({
  meta: {
    name: 'system.post.update',
    displayName: '更新岗位',
    description: '根据ID更新单个岗位信息',
    tags: ['system', 'post'],
    method: 'PUT',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: postSchemas.update }),
    outputSchema: postSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(post)
      .set(input.data as Partial<PostInsert>)
      .where(and(eq(post.id, input.id), isNull(post.deletedAt)))
      .returning();
    return result as PostSelect;
  },
});
