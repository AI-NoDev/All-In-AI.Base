/**
 * 分页查询任务日志
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog, jobLogSchemas } from '@qiyu-allinai/db/entities/system';
import { jobLogPaginationBodySchema } from './schemas';
import type { JobLogSelect } from '@qiyu-allinai/db/entities/system/jobLog';

export const jobLogGetByPagination = defineAction({
  meta: {
    name: 'system.jobLog.getByPagination',
    displayName: '分页查询任务日志',
    description: `分页查询定时任务执行日志。`,
    tags: ['system', 'jobLog'],
    method: 'POST',
    path: '/api/system/job-log/query',
  },
  schemas: {
    bodySchema: jobLogPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(jobLogSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(jobLog.id, filter.ids));
      if (filter.jobNames?.length) conditions.push(inArray(jobLog.jobName, filter.jobNames));
      if (filter.jobGroups?.length) conditions.push(inArray(jobLog.jobGroup, filter.jobGroups));
      if (filter.status) conditions.push(eq(jobLog.status, filter.status));
      if (filter.jobName) conditions.push(ilike(jobLog.jobName, `%${filter.jobName}%`));
      if (filter.jobGroup) conditions.push(ilike(jobLog.jobGroup, `%${filter.jobGroup}%`));
      if (filter.createdAtStart) conditions.push(gte(jobLog.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(jobLog.createdAt, filter.createdAtEnd));
      if (filter.startTimeStart) conditions.push(gte(jobLog.startTime, new Date(filter.startTimeStart)));
      if (filter.startTimeEnd) conditions.push(lte(jobLog.startTime, new Date(filter.startTimeEnd)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? jobLog[sort.field as keyof JobLogSelect] : jobLog.createdAt;

    const data = await db.select().from(jobLog)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(jobLog).where(whereClause);
    return { data: data as JobLogSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
