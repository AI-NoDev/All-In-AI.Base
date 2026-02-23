/**
 * 根据复合主键查询用户岗位关联
 */

import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userPost, userPostSchemas } from '@qiyu-allinai/db/entities/system';
import type { UserPostSelect } from '@qiyu-allinai/db/entities/system/userPost';

export const userPostGetByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userPost.getByPk',
    displayName: '根据复合主键查询用户岗位关联',
    description: `根据用户ID和岗位ID的复合主键查询关联记录。

**路径参数：**
- userId: 用户UUID，必填
- postId: 岗位UUID，必填

**返回：**
- 成功：返回关联对象 { userId, postId }
- 未找到：返回 null

**示例：**
GET /api/system/user-post/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002`,
    tags: ['system', 'userPost'],
    method: 'GET',
    path: '/api/system/user-post/:userId/:postId',
  },
  schemas: {
    paramsSchema: t.Object({ userId: t.String(), postId: t.String() }),
    outputSchema: t.Union([userPostSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(userPost)
      .where(and(eq(userPost.userId, input.userId), eq(userPost.postId, input.postId)))
      .limit(1);
    return (result as UserPostSelect) ?? null;
  },
});
