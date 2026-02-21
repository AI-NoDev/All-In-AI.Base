/**
 * 分页查询字典
 */

import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dict } from '@qiyu-allinai/db/entities/system';
import { dictPaginationBodySchema, dictZodSchemas } from './schemas';
import type { DictSelect } from './utils';

export const dictGetByPagination = defineAction({
  meta: {
    name: 'system.dict.getByPagination',
    displayName: '分页查询字典',
    description: `分页查询字典列表，自动排除已删除数据。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- groups: 按分组列表精确查询，如 ["sys_user_status", "sys_normal_disable"]
- labels: 按标签列表精确查询
- status: 按状态过滤，"0"=正常，"1"=禁用
- isDefault: 是否默认值
- group: 按分组模糊搜索
- label: 按标签模糊搜索
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: group | label | sort | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**示例 - 查询某分组的所有字典项：**
\`\`\`json
{
  "filter": { "groups": ["sys_user_status"] },
  "sort": { "field": "sort", "order": "asc" }
}
\`\`\``,
    tags: ['system', 'dict'],
    method: 'POST',
    path: '/api/system/dict/query',
  },
  schemas: {
    bodySchema: dictPaginationBodySchema,
    outputSchema: z.object({ data: z.array(dictZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [isNull(dict.deletedAt)];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(dict.id, filter.ids));
      if (filter.groups?.length) conditions.push(inArray(dict.group, filter.groups));
      if (filter.labels?.length) conditions.push(inArray(dict.label, filter.labels));
      if (filter.status) conditions.push(eq(dict.status, filter.status));
      if (filter.isDefault !== undefined) conditions.push(eq(dict.isDefault, filter.isDefault));
      if (filter.group) conditions.push(ilike(dict.group, `%${filter.group}%`));
      if (filter.label) conditions.push(ilike(dict.label, `%${filter.label}%`));
      if (filter.createdAtStart) conditions.push(gte(dict.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(dict.createdAt, filter.createdAtEnd));
    }

    const whereClause = and(...conditions);
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? dict[sort.field as keyof DictSelect] : dict.createdAt;

    const data = await db.select().from(dict)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(dict).where(whereClause);
    return { data: data as DictSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
