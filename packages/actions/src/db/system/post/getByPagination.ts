/**
 * 分页查询岗位
 */

import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post } from '@qiyu-allinai/db/entities/system';
import { postPaginationBodySchema, postZodSchemas } from './schemas';
import type { PostSelect } from './utils';

export const postGetByPagination = defineAction({
  meta: {
    name: 'system.post.getByPagination',
    displayName: '分页查询岗位',
    description: `分页查询岗位列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询，如 ["id1", "id2"]
- codes: 按岗位编码列表精确查询，如 ["CEO", "CTO", "PM"]
- names: 按岗位名称列表精确查询
- status: 按状态过滤，"0"=正常，"1"=禁用
- code: 按岗位编码模糊搜索，如 "C" 匹配 CEO、CTO
- name: 按岗位名称模糊搜索

**排序参数 (sort)：**
- field: code | name | sort | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
1. 获取所有正常状态的岗位：filter.status = "0"
2. 搜索包含"经理"的岗位：filter.name = "经理"
3. 按排序号升序排列：sort = { field: "sort", order: "asc" }

**示例：**
\`\`\`json
{
  "filter": { "status": "0", "name": "经理" },
  "sort": { "field": "sort", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['system', 'post'],
    method: 'POST',
    path: '/api/system/post/query',
  },
  schemas: {
    bodySchema: postPaginationBodySchema,
    outputSchema: z.object({ data: z.array(postZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [isNull(post.deletedAt)];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(post.id, filter.ids));
      if (filter.codes?.length) conditions.push(inArray(post.code, filter.codes));
      if (filter.names?.length) conditions.push(inArray(post.name, filter.names));
      if (filter.status) conditions.push(eq(post.status, filter.status));
      if (filter.code) conditions.push(ilike(post.code, `%${filter.code}%`));
      if (filter.name) conditions.push(ilike(post.name, `%${filter.name}%`));
      if (filter.createdAtStart) conditions.push(gte(post.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(post.createdAt, filter.createdAtEnd));
    }

    const whereClause = and(...conditions);
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? post[sort.field as keyof PostSelect] : post.createdAt;

    const data = await db.select().from(post)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(post).where(whereClause);
    return { data: data as PostSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
