/**
 * 批量更新岗位
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post, postSchemas } from '@qiyu-allinai/db/entities/system';
import type { PostSelect, PostInsert } from '@qiyu-allinai/db/entities/system/post';

export const postUpdateMany = defineAction({
  meta: {
    name: 'system.post.updateMany',
    ignoreTools: true,
    displayName: '批量更新岗位',
    description: '根据ID列表批量更新岗位',
    tags: ['system', 'post'],
    method: 'PUT',
    path: '/api/system/post/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: postSchemas.update }),
    outputSchema: t.Array(postSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: PostSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(post)
        .set(input.data as Partial<PostInsert>)
        .where(and(eq(post.id, id), isNull(post.deletedAt)))
        .returning();
      if (result) results.push(result as PostSelect);
    }
    return results;
  },
});
