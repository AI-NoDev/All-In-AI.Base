/**
 * 分页查询数据模型
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dataModel, dataModelSchemas } from '@qiyu-allinai/db/entities/ai';
import { dataModelPaginationBodySchema } from './schemas';
import type { DataModelSelect } from '@qiyu-allinai/db/entities/ai/dataModel';

export const dataModelGetByPagination = defineAction({
  meta: {
    name: 'ai.dataModel.getByPagination',
    displayName: '分页查询数据模型',
    description: `分页查询数据模型列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- name: 按名称模糊搜索
- status: 按状态过滤，"0"=启用，"1"=禁用
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20`,
    tags: ['ai', 'dataModel'],
    method: 'POST',
    path: '/api/ai/data-model/query',
  },
  schemas: {
    bodySchema: dataModelPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(dataModelSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(dataModel.id, filter.ids));
      if (filter.name) conditions.push(ilike(dataModel.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(dataModel.status, filter.status));
      if (filter.createdAtStart) conditions.push(gte(dataModel.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(dataModel.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? dataModel[sort.field as keyof DataModelSelect] : dataModel.createdAt;

    const data = await db.select().from(dataModel)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(dataModel).where(whereClause);
    return { data: data as DataModelSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
