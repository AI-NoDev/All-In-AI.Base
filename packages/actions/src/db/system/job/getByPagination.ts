/**
 * 分页查询定时任务
 */

import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job } from '@qiyu-allinai/db/entities/system';
import { jobPaginationBodySchema, jobZodSchemas } from './schemas';
import type { JobSelect } from './utils';

export const jobGetByPagination = defineAction({
  meta: {
    name: 'system.job.getByPagination',
    displayName: '分页查询定时任务',
    description: `分页查询定时任务列表，用于管理系统定时任务。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- names: 按任务名称列表精确查询
- groups: 按任务分组列表精确查询，如 ["DEFAULT", "SYSTEM"]
- status: 按状态过滤，"0"=正常，"1"=暂停
- concurrent: 是否允许并发，true/false
- name: 按任务名称模糊搜索
- group: 按任务分组模糊搜索
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | group | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
1. 获取所有正常运行的任务：filter.status = "0"
2. 获取某分组的任务：filter.group = "SYSTEM"
3. 搜索任务名称：filter.name = "清理"

**示例：**
\`\`\`json
{
  "filter": { "status": "0", "group": "DEFAULT" },
  "sort": { "field": "name", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['system', 'job'],
    method: 'POST',
    path: '/api/system/job/query',
  },
  schemas: {
    bodySchema: jobPaginationBodySchema,
    outputSchema: z.object({ data: z.array(jobZodSchemas.select), total: z.number() }),
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
