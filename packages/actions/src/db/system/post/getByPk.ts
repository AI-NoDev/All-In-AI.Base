/**
 * 根据ID查询岗位
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post } from '@qiyu-allinai/db/entities/system';
import { postZodSchemas } from './schemas';
import type { PostSelect } from './utils';

export const postGetByPk = defineAction({
  meta: {
    name: 'system.post.getByPk',
    displayName: '根据ID查询岗位',
    description: `根据主键ID查询单个岗位详情。

**参数说明：**
- id: 岗位的UUID主键

**返回值：**
- 成功：返回岗位完整信息（id, code, name, sort, status, remark等）
- 未找到：返回 null

**使用场景：**
1. 查看岗位详情
2. 编辑岗位前获取当前数据
3. 验证岗位是否存在

**示例：**
GET /api/system/post/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'post'],
    method: 'GET',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: postZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(post)
      .where(and(eq(post.id, input.id), isNull(post.deletedAt)))
      .limit(1);
    return (result as PostSelect) ?? null;
  },
});
