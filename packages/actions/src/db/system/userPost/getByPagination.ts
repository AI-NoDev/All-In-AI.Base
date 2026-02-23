/**
 * 分页查询用户岗位关联
 */

import { t } from 'elysia';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userPost, userPostSchemas } from '@qiyu-allinai/db/entities/system';
import { userPostPaginationBodySchema } from './schemas';
import type { UserPostSelect } from '@qiyu-allinai/db/entities/system/userPost';

export const userPostGetByPagination = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.userPost.getByPagination',
    displayName: '分页查询用户岗位关联',
    description: `分页查询用户与岗位的关联关系。

**过滤参数 (filter)：**
- userIds: 按用户ID列表查询，如 ["user-id-1", "user-id-2"]
- postIds: 按岗位ID列表查询，如 ["post-id-1", "post-id-2"]
- userId: 按单个用户ID精确查询
- postId: 按单个岗位ID精确查询

**排序参数 (sort)：**
- field: userId | postId
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
- 查询某用户关联的所有岗位
- 查询某岗位关联的所有用户
- 用户岗位配置管理

**示例：**
\`\`\`json
{
  "filter": { "userId": "550e8400-e29b-41d4-a716-446655440000" },
  "sort": { "field": "postId", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['system', 'userPost'],
    method: 'POST',
    path: '/api/system/user-post/query',
  },
  schemas: {
    bodySchema: userPostPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(userPostSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.userIds?.length) conditions.push(inArray(userPost.userId, filter.userIds));
      if (filter.postIds?.length) conditions.push(inArray(userPost.postId, filter.postIds));
      if (filter.userId) conditions.push(eq(userPost.userId, filter.userId));
      if (filter.postId) conditions.push(eq(userPost.postId, filter.postId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? userPost[sort.field as keyof UserPostSelect] : userPost.userId;

    const data = await db.select().from(userPost)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(userPost).where(whereClause);
    return { data: data as UserPostSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
