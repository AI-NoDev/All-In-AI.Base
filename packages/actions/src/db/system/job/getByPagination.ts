/**
 * 分页查询定时任务
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job, jobSchemas } from '@qiyu-allinai/db/entities/system';
import { jobPaginationBodySchema } from './schemas';
import type { JobSelect } from '@qiyu-allinai/db/entities/system/job';

export const jobGetByPagination = defineAction({
  meta: {
    name: 'system.job.getByPagination',
    displayName: '分页查询定时任务',
    description: `分页查询定时任务列表，用于管理系统定时任务。`,
    tags: ['system', 'job'],
    method: 'POST',
    path: '/api/system/job/query',
  },
  schemas: {
    bodySchema: jobPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(jobSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(job.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(job.name, filter.names));
      if (filter.groups?.length) conditions.push(inArray(job.group, filter.groups));
      if (filter.status) conditions.push(eq(job.status, filter.status));
      if (filter.concurrent !== undefined) conditions.push(eq(job.concurrent, filter.concurrent));
      if (filter.name) conditions.push(ilike(job.name, `%${filter.name}%`));
      if (filter.group) conditions.push(ilike(job.group, `%${filter.group}%`));
      if (filter.createdAtStart) conditions.push(gte(job.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(job.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? job[sort.field as keyof JobSelect] : job.createdAt;

    const data = await db.select().from(job)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(job).where(whereClause);
    return { data: data as JobSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
