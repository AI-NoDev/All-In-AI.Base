/**
 * 分页查询系统配置
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config, configSchemas } from '@qiyu-allinai/db/entities/system';
import { configPaginationBodySchema } from './schemas';
import type { ConfigSelect } from './utils';

export const configGetByPagination = defineAction({
  meta: {
    name: 'system.config.getByPagination',
    displayName: '分页查询系统配置',
    description: '分页查询系统配置列表，支持多种过滤和排序方式。',
    tags: ['system', 'config'],
    method: 'POST',
    path: '/api/system/config/query',
  },
  schemas: {
    bodySchema: configPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(configSchemas.select), total: t.Number() }),
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
