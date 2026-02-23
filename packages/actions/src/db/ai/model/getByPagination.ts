/**
 * 分页查询AI模型
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { model, modelSchemas } from '@qiyu-allinai/db/entities/ai';
import { modelPaginationBodySchema } from './schemas';
import type { ModelSelect } from '@qiyu-allinai/db/entities/ai/model';

export const modelGetByPagination = defineAction({
  meta: {
    name: 'ai.model.getByPagination',
    displayName: '分页查询AI模型',
    description: `分页查询AI模型列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询，如 ["id1", "id2"]
- modelIds: 按模型标识列表查询，如 ["gpt-4", "claude-3"]
- providerId: 按单个提供商ID过滤
- providerIds: 按多个提供商ID过滤
- name: 按名称模糊搜索
- modelId: 按模型标识模糊搜索
- status: 按状态过滤，"0"=正常，"1"=禁用
- supportTools: 是否支持工具调用，true/false
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | modelId | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**示例：**
\`\`\`json
{
  "filter": { "providerId": "xxx", "supportTools": true },
  "sort": { "field": "createdAt", "order": "desc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['ai', 'model'],
    method: 'POST',
    path: '/api/ai/model/query',
  },
  schemas: {
    bodySchema: modelPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(modelSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(model.id, filter.ids));
      if (filter.modelIds?.length) conditions.push(inArray(model.modelId, filter.modelIds));
      if (filter.providerId) conditions.push(eq(model.providerId, filter.providerId));
      if (filter.providerIds?.length) conditions.push(inArray(model.providerId, filter.providerIds));
      if (filter.name) conditions.push(ilike(model.name, `%${filter.name}%`));
      if (filter.modelId) conditions.push(ilike(model.modelId, `%${filter.modelId}%`));
      if (filter.status) conditions.push(eq(model.status, filter.status));
      if (filter.supportTools !== undefined) conditions.push(eq(model.supportTools, filter.supportTools));
      if (filter.createdAtStart) conditions.push(gte(model.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(model.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? model[sort.field as keyof ModelSelect] : model.createdAt;

    const data = await db.select().from(model)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(model).where(whereClause);
    return { data: data as ModelSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
