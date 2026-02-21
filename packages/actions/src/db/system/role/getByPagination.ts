/**
 * 分页查询角色
 */

import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { role } from '@qiyu-allinai/db/entities/system';
import { rolePaginationBodySchema, roleZodSchemas } from './schemas';
import type { RoleSelect } from './utils';

export const roleGetByPagination = defineAction({
  meta: {
    name: 'system.role.getByPagination',
    displayName: '分页查询角色',
    description: `分页查询角色列表，自动排除已删除数据。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- names: 按名称列表精确查询
- keys: 按角色标识列表精确查询，如 ["admin", "user"]
- status: 按状态过滤，"0"=正常，"1"=禁用
- name: 按名称模糊搜索
- key: 按角色标识模糊搜索
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | key | sort | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**示例：**
\`\`\`json
{
  "filter": { "status": "0" },
  "sort": { "field": "sort", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['system', 'role'],
    method: 'POST',
    path: '/api/system/role/query',
  },
  schemas: {
    bodySchema: rolePaginationBodySchema,
    outputSchema: z.object({ data: z.array(roleZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [isNull(role.deletedAt)];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(role.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(role.name, filter.names));
      if (filter.keys?.length) conditions.push(inArray(role.key, filter.keys));
      if (filter.status) conditions.push(eq(role.status, filter.status));
      if (filter.name) conditions.push(ilike(role.name, `%${filter.name}%`));
      if (filter.key) conditions.push(ilike(role.key, `%${filter.key}%`));
      if (filter.createdAtStart) conditions.push(gte(role.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(role.createdAt, filter.createdAtEnd));
    }

    const whereClause = and(...conditions);
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? role[sort.field as keyof RoleSelect] : role.createdAt;

    const data = await db.select().from(role)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(role).where(whereClause);
    return { data: data as RoleSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
