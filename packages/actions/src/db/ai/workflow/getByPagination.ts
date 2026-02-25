/**
 * 分页查询工作流
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { workflow, workflowSchemas } from '@qiyu-allinai/db/entities/ai';
import { workflowPaginationBodySchema } from './schemas';
import type { WorkflowSelect } from '@qiyu-allinai/db/entities/ai/workflow';

export const workflowGetByPagination = defineAction({
  meta: {
    name: 'ai.workflow.getByPagination',
    displayName: '分页查询工作流',
    description: `分页查询工作流列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- name: 按名称模糊搜索
- status: 按状态过滤，"0"=草稿，"1"=已发布，"2"=已禁用
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | version | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20`,
    tags: ['ai', 'workflow'],
    method: 'POST',
    path: '/api/ai/workflow/query',
  },
  schemas: {
    bodySchema: workflowPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(workflowSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(workflow.id, filter.ids));
      if (filter.name) conditions.push(ilike(workflow.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(workflow.status, filter.status));
      if (filter.createdAtStart) conditions.push(gte(workflow.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(workflow.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? workflow[sort.field as keyof WorkflowSelect] : workflow.createdAt;

    const data = await db.select().from(workflow)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(workflow).where(whereClause);
    return { data: data as WorkflowSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
