/**
 * 删除岗位
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post } from '@qiyu-allinai/db/entities/system';

export const postDeleteByPk = defineAction({
  meta: {
    name: 'system.post.deleteByPk',
    displayName: '删除岗位',
    description: `根据ID软删除岗位（逻辑删除，数据保留）。

**参数说明：**
- id: 岗位UUID

**删除行为：**
- 软删除：设置 deletedAt、deletedBy、deletedById
- 数据保留在数据库中，可恢复
- 查询时自动过滤已删除记录

**返回值：**
- true: 删除成功
- false: 岗位不存在或已删除

**注意事项：**
- 删除前应检查是否有用户关联此岗位
- 已删除的岗位不会出现在查询结果中

**示例：**
DELETE /api/system/post/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'post'],
    method: 'DELETE',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(post)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(eq(post.id, input.id), isNull(post.deletedAt)))
      .returning();
    return !!result;
  },
});
