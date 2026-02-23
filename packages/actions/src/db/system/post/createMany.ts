/**
 * 批量创建岗位
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { post, postSchemas } from '@qiyu-allinai/db/entities/system';
import type { PostSelect, PostInsert } from '@qiyu-allinai/db/entities/system/post';

export const postCreateMany = defineAction({
  meta: {
    name: 'system.post.createMany',
    ignoreTools: true,
    displayName: '批量创建岗位',
    description: '批量创建多个岗位记录',
    tags: ['system', 'post'],
    method: 'POST',
    path: '/api/system/post/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(postSchemas.insert) }),
    outputSchema: t.Array(postSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(post).values(input.data as PostInsert[]).returning();
    return results as PostSelect[];
  },
});
