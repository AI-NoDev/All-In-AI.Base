/**
 * 分页查询操作日志
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { operationLog, operationLogSchemas } from '@qiyu-allinai/db/entities/system';
import { operationLogPaginationBodySchema } from './schemas';
import type { OperationLogSelect } from '@qiyu-allinai/db/entities/system/operationLog';

export const operationLogGetByPagination = defineAction({
  meta: {
    name: 'system.operationLog.getByPagination',
    displayName: '分页查询操作日志',
    description: '分页查询操作日志列表，用于审计用户操作行为',
    tags: ['system', 'operationLog'],
    method: 'POST',
    path: '/api/system/operation-log/query',
  },
  schemas: {
    bodySchema: operationLogPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(operationLogSchemas.select), total: t.Number() }),
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
