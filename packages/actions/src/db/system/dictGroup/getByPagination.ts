/**
 * 分页查询字典组
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dictGroup, dictGroupSchemas } from '@qiyu-allinai/db/entities/system';
import { dictGroupPaginationBodySchema } from './schemas';
import type { DictGroupSelect } from '@qiyu-allinai/db/entities/system/dictGroup';

export const dictGroupGetByPagination = defineAction({
  meta: {
    name: 'system.dictGroup.getByPagination',
    displayName: '分页查询字典组',
    description: `分页查询字典组列表，字典组用于管理一组相关的字典项。

**过滤参数 (filter)：**
- keys: 按字典组键列表精确查询，如 ["sys_user_sex", "sys_normal_disable"]
- names: 按字典组名称列表精确查询
- status: 按状态过滤，"0"=正常，"1"=禁用
- key: 按字典组键模糊搜索，如 "sys" 匹配所有系统字典
- name: 按字典组名称模糊搜索
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: key | name | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20`,
    tags: ['system', 'dictGroup'],
    method: 'POST',
    path: '/api/system/dict-group/query',
  },
  schemas: {
    bodySchema: dictGroupPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(dictGroupSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.keys?.length) conditions.push(inArray(dictGroup.key, filter.keys));
      if (filter.names?.length) conditions.push(inArray(dictGroup.name, filter.names));
      if (filter.status) conditions.push(eq(dictGroup.status, filter.status));
      if (filter.key) conditions.push(ilike(dictGroup.key, `%${filter.key}%`));
      if (filter.name) conditions.push(ilike(dictGroup.name, `%${filter.name}%`));
      if (filter.createdAtStart) conditions.push(gte(dictGroup.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(dictGroup.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? dictGroup[sort.field as keyof DictGroupSelect] : dictGroup.createdAt;

    const data = await db.select().from(dictGroup)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(dictGroup).where(whereClause);
    return { data: data as DictGroupSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
