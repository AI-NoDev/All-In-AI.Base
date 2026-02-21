/**
 * 分页查询任务日志
 */

import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog } from '@qiyu-allinai/db/entities/system';
import { jobLogPaginationBodySchema, jobLogZodSchemas } from './schemas';
import type { JobLogSelect } from './utils';

export const jobLogGetByPagination = defineAction({
  meta: {
    name: 'system.jobLog.getByPagination',
    displayName: '分页查询任务日志',
    description: `分页查询定时任务执行日志，用于监控任务执行情况。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- jobNames: 按任务名称列表精确查询
- jobGroups: 按任务分组列表精确查询
- status: 按状态过滤，"0"=成功，"1"=失败
- jobName: 按任务名称模糊搜索
- jobGroup: 按任务分组模糊搜索
- startTimeStart/startTimeEnd: 执行开始时间范围
- createdAtStart/createdAtEnd: 记录创建时间范围

**排序参数 (sort)：**
- field: jobName | jobGroup | startTime | stopTime | createdAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
1. 查看某任务的执行历史：filter.jobName = "清理日志"
2. 查看执行失败的任务：filter.status = "1"
3. 查看今日执行记录：设置 startTimeStart/startTimeEnd

**示例：**
\`\`\`json
{
  "filter": { "status": "1", "jobGroup": "SYSTEM" },
  "sort": { "field": "startTime", "order": "desc" },
  "offset": 0,
  "limit": 50
}
\`\`\``,
    tags: ['system', 'jobLog'],
    method: 'POST',
    path: '/api/system/job-log/query',
  },
  schemas: {
    bodySchema: jobLogPaginationBodySchema,
    outputSchema: z.object({ data: z.array(jobLogZodSchemas.select), total: z.number() }),
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
