/**
 * 分页查询AI提供商
 */

import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { provider } from '@qiyu-allinai/db/entities/ai';
import { providerPaginationBodySchema, providerZodSchemas } from './schemas';
import type { ProviderSelect } from './utils';

export const providerGetByPagination = defineAction({
  meta: {
    name: 'ai.provider.getByPagination',
    displayName: '分页查询AI提供商',
    description: `分页查询AI提供商列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- names: 按名称列表精确查询，如 ["OpenAI", "Anthropic"]
- name: 按名称模糊搜索
- status: 按状态过滤，"0"=正常，"1"=禁用
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**示例：**
\`\`\`json
{
  "filter": { "status": "0" },
  "sort": { "field": "name", "order": "asc" },
  "offset": 0,
  "limit": 50
}
\`\`\``,
    tags: ['ai', 'provider'],
    method: 'POST',
    path: '/api/ai/provider/query',
  },
  schemas: {
    bodySchema: providerPaginationBodySchema,
    outputSchema: z.object({ data: z.array(providerZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(provider.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(provider.name, filter.names));
      if (filter.name) conditions.push(ilike(provider.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(provider.status, filter.status));
      if (filter.createdAtStart) conditions.push(gte(provider.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(provider.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? provider[sort.field as keyof ProviderSelect] : provider.createdAt;

    const data = await db.select().from(provider)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(provider).where(whereClause);
    return { data: data as ProviderSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
