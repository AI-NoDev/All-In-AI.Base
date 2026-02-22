/**
 * 批量更新岗位
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post } from '@qiyu-allinai/db/entities/system';
import { postZodSchemas } from './schemas';
import type { PostSelect, PostInsert } from './utils';

export const postUpdateMany = defineAction({
  meta: {
    name: 'system.post.updateMany',
    ignoreTools: true,
    displayName: '批量更新岗位',
    description: `根据ID列表批量更新岗位，所有指定的岗位将应用相同的更新数据。

**参数说明：**
- ids: 要更新的岗位ID数组
- data: 更新的字段数据

**使用场景：**
1. 批量启用/禁用岗位：设置 status
2. 批量调整排序：设置 sort
3. 批量添加备注

**示例：**
\`\`\`json
{
  "ids": ["id1", "id2", "id3"],
  "data": {
    "status": "1",
    "remark": "已停用"
  }
}
\`\`\``,
    tags: ['system', 'post'],
    method: 'PUT',
    path: '/api/system/post/batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: postZodSchemas.update }),
    outputSchema: z.array(postZodSchemas.select),
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
