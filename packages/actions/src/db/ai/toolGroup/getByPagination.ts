/**
 * 分页查询工具组
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toolGroup, toolGroupSchemas } from '@qiyu-allinai/db/entities/ai';
import { toolGroupPaginationBodySchema } from './schemas';
import type { ToolGroupSelect } from '@qiyu-allinai/db/entities/ai/toolGroup';

export const toolGroupGetByPagination = defineAction({
  meta: {
    name: 'ai.toolGroup.getByPagination',
    displayName: '分页查询工具组',
    description: `分页查询AI工具组列表，工具组用于组织和管理AI可调用的工具。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- names: 按名称列表精确查询
- name: 按名称模糊搜索
- status: 按状态过滤
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | orderNum | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**示例：**
\`\`\`json
{
  "filter": { "name": "代码" },
  "sort": { "field": "orderNum", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['ai', 'toolGroup'],
    method: 'POST',
    path: '/api/ai/tool-group/query',
  },
  schemas: {
    bodySchema: toolGroupPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(toolGroupSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(toolGroup.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(toolGroup.name, filter.names));
      if (filter.name) conditions.push(ilike(toolGroup.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(toolGroup.status, filter.status));
      if (filter.createdAtStart) conditions.push(gte(toolGroup.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(toolGroup.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? toolGroup[sort.field as keyof ToolGroupSelect] : toolGroup.createdAt;

    const data = await db.select().from(toolGroup)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(toolGroup).where(whereClause);
    return { data: data as ToolGroupSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
