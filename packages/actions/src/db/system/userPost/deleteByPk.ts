/**
 * 删除用户岗位关联
 */

import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userPost } from '@qiyu-allinai/db/entities/system';

export const userPostDeleteByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userPost.deleteByPk',
    displayName: '删除用户岗位关联',
    description: `根据复合主键删除用户与岗位的关联关系。

**路径参数：**
- userId: 用户UUID，必填
- postId: 岗位UUID，必填

**返回：**
- true: 删除成功
- false: 删除失败（关联不存在）

**示例：**
DELETE /api/system/user-post/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002`,
    tags: ['system', 'userPost'],
    method: 'DELETE',
    path: '/api/system/user-post/:userId/:postId',
  },
  schemas: {
    paramsSchema: z.object({ userId: z.string(), postId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(userPost)
      .where(and(eq(userPost.userId, input.userId), eq(userPost.postId, input.postId)))
      .returning();
    return !!result;
  },
});
