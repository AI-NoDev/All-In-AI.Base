/**
 * 分页查询菜单
 */

import { z } from 'zod';
import { eq, sql, ilike, and, isNull, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { menu } from '@qiyu-allinai/db/entities/system';
import { menuPaginationBodySchema, menuZodSchemas } from './schemas';
import type { MenuSelect } from './utils';

export const menuGetByPagination = defineAction({
  meta: {
    name: 'system.menu.getByPagination',
    displayName: '分页查询菜单',
    description: `分页查询菜单列表，支持树形结构查询。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- names: 按名称列表精确查询
- types: 按类型列表查询，M=目录，C=菜单，F=按钮
- parentId: 按父级ID过滤，null表示查询顶级菜单
- type: 按单个类型过滤
- visible: 是否可见
- name: 按名称模糊搜索
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | orderNum | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**示例 - 查询顶级目录：**
\`\`\`json
{
  "filter": { "parentId": null, "type": "M" },
  "sort": { "field": "orderNum", "order": "asc" }
}
\`\`\`

**示例 - 查询某目录下的菜单：**
\`\`\`json
{
  "filter": { "parentId": "parent-uuid", "types": ["C", "F"] }
}
\`\`\``,
    tags: ['system', 'menu'],
    method: 'POST',
    path: '/api/system/menu/query',
  },
  schemas: {
    bodySchema: menuPaginationBodySchema,
    outputSchema: z.object({ data: z.array(menuZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(menu.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(menu.name, filter.names));
      if (filter.types?.length) conditions.push(inArray(menu.type, filter.types));
      if (filter.parentId === null) {
        conditions.push(isNull(menu.parentId));
      } else if (filter.parentId) {
        conditions.push(eq(menu.parentId, filter.parentId));
      }
      if (filter.type) conditions.push(eq(menu.type, filter.type));
      if (filter.visible !== undefined) conditions.push(eq(menu.visible, filter.visible));
      if (filter.name) conditions.push(ilike(menu.name, `%${filter.name}%`));
      if (filter.createdAtStart) conditions.push(gte(menu.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(menu.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? menu[sort.field as keyof MenuSelect] : menu.createdAt;

    const data = await db.select().from(menu)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(menu).where(whereClause);
    return { data: data as MenuSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
