/**
 * 创建岗位
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { post, postSchemas } from '@qiyu-allinai/db/entities/system';
import type { PostSelect, PostInsert } from '@qiyu-allinai/db/entities/system/post';

export const postCreate = defineAction({
  meta: {
    name: 'system.post.create',
    displayName: '创建岗位',
    description: '创建单个岗位记录',
    tags: ['system', 'post'],
    method: 'POST',
    path: '/api/system/post',
  },
  schemas: {
    bodySchema: t.Object({ data: postSchemas.insert }),
    outputSchema: postSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(post).values(input.data as PostInsert).returning();
    return result as PostSelect;
  },
});
