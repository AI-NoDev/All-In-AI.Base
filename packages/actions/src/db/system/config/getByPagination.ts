/**
 * 分页查询系统配置
 */

import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config } from '@qiyu-allinai/db/entities/system';
import { configPaginationBodySchema, configZodSchemas } from './schemas';
import type { ConfigSelect } from './utils';

export const configGetByPagination = defineAction({
  meta: {
    name: 'system.config.getByPagination',
    displayName: '分页查询系统配置',
    description: `分页查询系统配置列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- names: 按配置名称列表精确查询
- keys: 按配置键列表精确查询，如 ["sys.name", "sys.logo"]
- isSystem: 是否系统内置配置，true=内置，false=自定义
- name: 按配置名称模糊搜索
- key: 按配置键模糊搜索，如 "sys" 匹配所有 sys.* 配置
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: name | key | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
1. 获取所有系统内置配置：filter.isSystem = true
2. 搜索包含"邮件"的配置：filter.name = "邮件"
3. 获取所有 sys.* 开头的配置：filter.key = "sys"

**示例：**
\`\`\`json
{
  "filter": { "isSystem": false, "key": "mail" },
  "sort": { "field": "key", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['system', 'config'],
    method: 'POST',
    path: '/api/system/config/query',
  },
  schemas: {
    bodySchema: configPaginationBodySchema,
    outputSchema: z.object({ data: z.array(configZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(config.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(config.name, filter.names));
      if (filter.keys?.length) conditions.push(inArray(config.key, filter.keys));
      if (filter.isSystem !== undefined) conditions.push(eq(config.isSystem, filter.isSystem));
      if (filter.name) conditions.push(ilike(config.name, `%${filter.name}%`));
      if (filter.key) conditions.push(ilike(config.key, `%${filter.key}%`));
      if (filter.createdAtStart) conditions.push(gte(config.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(config.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? config[sort.field as keyof ConfigSelect] : config.createdAt;

    const data = await db.select().from(config)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(config).where(whereClause);
    return { data: data as ConfigSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
