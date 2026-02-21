/**
 * 更新岗位
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post } from '@qiyu-allinai/db/entities/system';
import { postZodSchemas } from './schemas';
import type { PostSelect, PostInsert } from './utils';

export const postUpdate = defineAction({
  meta: {
    name: 'system.post.update',
    displayName: '更新岗位',
    description: `根据ID更新单个岗位信息。

**路径参数：**
- id: 岗位UUID

**可更新字段：**
- code: 岗位编码
- name: 岗位名称
- sort: 排序号
- status: 状态，"0"=正常，"1"=禁用
- remark: 备注

**使用场景：**
1. 修改岗位名称或编码
2. 调整岗位排序
3. 启用/禁用岗位

**示例：**
\`\`\`json
// PUT /api/system/post/550e8400-e29b-41d4-a716-446655440000
{
  "data": {
    "name": "高级项目经理",
    "sort": 5,
    "status": "0"
  }
}
\`\`\``,
    tags: ['system', 'post'],
    method: 'PUT',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: postZodSchemas.update }),
    outputSchema: postZodSchemas.select,
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
