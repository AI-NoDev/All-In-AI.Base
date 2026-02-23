/**
 * 根据ID查询岗位
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post, postSchemas } from '@qiyu-allinai/db/entities/system';
import type { PostSelect } from '@qiyu-allinai/db/entities/system/post';

export const postGetByPk = defineAction({
  meta: {
    name: 'system.post.getByPk',
    displayName: '根据ID查询岗位',
    description: '根据主键ID查询单个岗位详情',
    tags: ['system', 'post'],
    method: 'GET',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([postSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(post)
      .where(and(eq(post.id, input.id), isNull(post.deletedAt)))
      .limit(1);
    return (result as PostSelect) ?? null;
  },
});
