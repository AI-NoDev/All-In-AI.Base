/**
 * 分页查询操作日志
 */

import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { operationLog } from '@qiyu-allinai/db/entities/system';
import { operationLogPaginationBodySchema, operationLogZodSchemas } from './schemas';
import type { OperationLogSelect } from './utils';

export const operationLogGetByPagination = defineAction({
  meta: {
    name: 'system.operationLog.getByPagination',
    displayName: '分页查询操作日志',
    description: `分页查询操作日志列表，用于审计用户操作行为。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- titles: 按操作模块列表精确查询，如 ["用户管理", "角色管理"]
- names: 按操作人员列表精确查询
- status: 按状态过滤，"0"=成功，"1"=失败
- title: 按操作模块模糊搜索，如 "用户" 匹配用户相关操作
- name: 按操作人员模糊搜索
- timeStart/timeEnd: 操作时间范围

**排序参数 (sort)：**
- field: title | name | time
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
1. 查看某用户的操作历史：filter.name = "admin"
2. 查看某模块的操作记录：filter.title = "用户管理"
3. 查看操作失败记录：filter.status = "1"
4. 查看今日操作记录：设置 timeStart/timeEnd

**示例：**
\`\`\`json
{
  "filter": { "title": "用户", "status": "0" },
  "sort": { "field": "time", "order": "desc" },
  "offset": 0,
  "limit": 50
}
\`\`\``,
    tags: ['system', 'operationLog'],
    method: 'POST',
    path: '/api/system/operation-log/query',
  },
  schemas: {
    bodySchema: operationLogPaginationBodySchema,
    outputSchema: z.object({ data: z.array(operationLogZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(operationLog.id, filter.ids));
      if (filter.titles?.length) conditions.push(inArray(operationLog.title, filter.titles));
      if (filter.names?.length) conditions.push(inArray(operationLog.name, filter.names));
      if (filter.status) conditions.push(eq(operationLog.status, filter.status));
      if (filter.title) conditions.push(ilike(operationLog.title, `%${filter.title}%`));
      if (filter.name) conditions.push(ilike(operationLog.name, `%${filter.name}%`));
      if (filter.timeStart) conditions.push(gte(operationLog.time, new Date(filter.timeStart)));
      if (filter.timeEnd) conditions.push(lte(operationLog.time, new Date(filter.timeEnd)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? operationLog[sort.field as keyof OperationLogSelect] : operationLog.time;

    const data = await db.select().from(operationLog)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(operationLog).where(whereClause);
    return { data: data as OperationLogSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
