/**
 * 分页查询岗位
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { post, postSchemas } from '@qiyu-allinai/db/entities/system';
import { postPaginationBodySchema } from './schemas';
import type { PostSelect } from '@qiyu-allinai/db/entities/system/post';

export const postGetByPagination = defineAction({
  meta: {
    name: 'system.post.getByPagination',
    displayName: '分页查询岗位',
    description: '分页查询岗位列表，支持多种过滤和排序方式',
    tags: ['system', 'post'],
    method: 'POST',
    path: '/api/system/post/query',
  },
  schemas: {
    bodySchema: postPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(postSchemas.select), total: t.Number() }),
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
