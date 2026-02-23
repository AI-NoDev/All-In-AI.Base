/**
 * 创建用户岗位关联
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { userPost, userPostSchemas } from '@qiyu-allinai/db/entities/system';
import type { UserPostSelect, UserPostInsert } from '@qiyu-allinai/db/entities/system/userPost';

export const userPostCreate = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userPost.create',
    displayName: '创建用户岗位关联',
    description: `创建单个用户与岗位的关联关系。

**请求体参数 (data)：**
- userId: 用户UUID，必填
- postId: 岗位UUID，必填

**使用场景：**
- 为用户分配单个岗位
- 用户入职时配置岗位

**示例：**
\`\`\`json
{
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "postId": "550e8400-e29b-41d4-a716-446655440002"
  }
}
\`\`\``,
    tags: ['system', 'userPost'],
    method: 'POST',
    path: '/api/system/user-post',
  },
  schemas: {
    bodySchema: t.Object({ data: userPostSchemas.insert }),
    outputSchema: userPostSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(userPost).values(input.data as UserPostInsert).returning();
    return result as UserPostSelect;
  },
});
