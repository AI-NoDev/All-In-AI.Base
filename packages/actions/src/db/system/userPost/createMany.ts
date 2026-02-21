/**
 * 批量创建用户岗位关联
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { userPost } from '@qiyu-allinai/db/entities/system';
import { userPostZodSchemas } from './schemas';
import type { UserPostSelect, UserPostInsert } from './utils';

export const userPostCreateMany = defineAction({
  meta: {
    name: 'system.userPost.createMany',
    displayName: '批量创建用户岗位关联',
    description: `批量创建多个用户与岗位的关联关系。

**请求体参数 (data)：**
- 数组，每个元素包含：
  - userId: 用户UUID，必填
  - postId: 岗位UUID，必填

**使用场景：**
- 为用户一次性分配多个岗位
- 批量导入用户岗位关联

**示例：**
\`\`\`json
{
  "data": [
    { "userId": "user-1", "postId": "post-1" },
    { "userId": "user-1", "postId": "post-2" },
    { "userId": "user-2", "postId": "post-1" }
  ]
}
\`\`\``,
    tags: ['system', 'userPost'],
    method: 'POST',
    path: '/api/system/user-post/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(userPostZodSchemas.insert) }),
    outputSchema: z.array(userPostZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(userPost).values(input.data as UserPostInsert[]).returning();
    return results as UserPostSelect[];
  },
});
