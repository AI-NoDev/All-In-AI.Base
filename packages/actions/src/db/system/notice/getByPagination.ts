/**
 * 分页查询通知公告
 */

import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice } from '@qiyu-allinai/db/entities/system';
import { noticePaginationBodySchema, noticeZodSchemas } from './schemas';
import type { NoticeSelect } from './utils';

export const noticeGetByPagination = defineAction({
  meta: {
    name: 'system.notice.getByPagination',
    displayName: '分页查询通知公告',
    description: `分页查询通知公告列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- titles: 按标题列表精确查询
- types: 按类型列表精确查询，如 ["1", "2"]
- type: 按类型精确匹配，"1"=通知，"2"=公告
- status: 按状态过滤，"0"=正常，"1"=关闭
- title: 按标题模糊搜索
- createdAtStart/createdAtEnd: 创建时间范围

**排序参数 (sort)：**
- field: title | type | createdAt | updatedAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
1. 获取所有公告：filter.type = "2"
2. 搜索标题包含"系统"的通知：filter.title = "系统"
3. 获取最近一周的通知：设置 createdAtStart

**示例：**
\`\`\`json
{
  "filter": { "type": "1", "status": "0" },
  "sort": { "field": "createdAt", "order": "desc" },
  "offset": 0,
  "limit": 10
}
\`\`\``,
    tags: ['system', 'notice'],
    method: 'POST',
    path: '/api/system/notice/query',
  },
  schemas: {
    bodySchema: noticePaginationBodySchema,
    outputSchema: z.object({ data: z.array(noticeZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(notice.id, filter.ids));
      if (filter.titles?.length) conditions.push(inArray(notice.title, filter.titles));
      if (filter.types?.length) conditions.push(inArray(notice.type, filter.types));
      if (filter.type) conditions.push(eq(notice.type, filter.type));
      if (filter.status) conditions.push(eq(notice.status, filter.status));
      if (filter.title) conditions.push(ilike(notice.title, `%${filter.title}%`));
      if (filter.createdAtStart) conditions.push(gte(notice.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(notice.createdAt, filter.createdAtEnd));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? notice[sort.field as keyof NoticeSelect] : notice.createdAt;

    const data = await db.select().from(notice)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(notice).where(whereClause);
    return { data: data as NoticeSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
