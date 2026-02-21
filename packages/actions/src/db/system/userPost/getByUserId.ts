/**
 * 获取用户的岗位ID列表
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userPost } from '@qiyu-allinai/db/entities/system';

export const userPostGetByUserId = defineAction({
  meta: {
    name: 'system.userPost.getByUserId',
    displayName: '获取用户岗位',
    description: `获取指定用户的所有岗位ID列表。

**路径参数：**
- userId: 用户UUID，必填

**返回：**
- 岗位ID数组，如 ["post-id-1", "post-id-2", "post-id-3"]

**使用场景：**
- 用户详情页面，显示用户所属岗位
- 用户编辑页面，获取当前用户已分配的岗位
- 权限判断，检查用户是否属于某岗位

**示例：**
GET /api/system/user-post/user/550e8400-e29b-41d4-a716-446655440000

**返回示例：**
\`\`\`json
["post-id-1", "post-id-2", "post-id-3"]
\`\`\``,
    tags: ['system', 'userPost'],
    method: 'GET',
    path: '/api/system/user-post/user/:userId',
  },
  schemas: {
    paramsSchema: z.object({ userId: z.string() }),
    outputSchema: z.array(z.string()),
  },
  execute: async (input, context) => {
    const { db } = context;
    const data = await db.select({ postId: userPost.postId }).from(userPost).where(eq(userPost.userId, input.userId));
    return data.map(d => d.postId);
  },
});
