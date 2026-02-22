/**
 * 获取当前用户的通知列表
 */

import { z } from 'zod';
import { eq, and, sql, desc, asc, or, arrayContains, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice, noticeRead, NOTICE_STATUS, NOTICE_TARGET_TYPE } from '@qiyu-allinai/db/entities/system';
import { noticeZodSchemas } from './schemas';

/** 我的通知过滤条件 Schema */
const myNoticesFilterSchema = z.object({
  type: z.string().optional().describe('类型：1=通知，2=公告'),
  isRead: z.boolean().optional().describe('是否已读'),
}).optional();

/** 我的通知排序 Schema */
const myNoticesSortSchema = z.object({
  field: z.enum(['publishedAt', 'createdAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional();

/** 我的通知请求体 Schema */
const myNoticesBodySchema = z.object({
  filter: myNoticesFilterSchema,
  sort: myNoticesSortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});

/** 通知列表项（包含已读状态） */
const noticeWithReadSchema = noticeZodSchemas.select.extend({
  isRead: z.boolean().describe('是否已读'),
  readAt: z.string().nullable().describe('阅读时间'),
});

export const noticeGetMyNotices = defineAction({
  meta: {
    name: 'system.notice.getMyNotices',
    displayName: '获取我的通知',
    description: `获取当前用户可见的通知列表，支持按已读状态过滤。

**过滤参数 (filter)：**
- type: 按类型过滤，"1"=通知，"2"=公告
- isRead: 按已读状态过滤，true=已读，false=未读

**排序参数 (sort)：**
- field: publishedAt | createdAt
- order: asc | desc

**返回数据：**
- 包含 isRead 和 readAt 字段表示已读状态`,
    tags: ['system', 'notice'],
    method: 'POST',
    path: '/api/system/notice/my',
  },
  schemas: {
    bodySchema: myNoticesBodySchema,
    outputSchema: z.object({ 
      data: z.array(noticeWithReadSchema), 
      total: z.number() 
    }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    const { filter, sort, offset, limit } = input;

    if (!currentUserId) {
      throw new Error('error.auth.unauthorized');
    }

    // 基础条件：已发布 + (全部用户 或 包含当前用户)
    const baseConditions = [
      eq(notice.status, NOTICE_STATUS.PUBLISHED),
      or(
        eq(notice.targetType, NOTICE_TARGET_TYPE.ALL),
        arrayContains(notice.targetUserIds, [currentUserId])
      ),
    ];

    // 类型过滤
    if (filter?.type) {
      baseConditions.push(eq(notice.type, filter.type));
    }

    const whereClause = and(...baseConditions);

    // 获取用户已读的通知
    const readRecords = await db.select().from(noticeRead)
      .where(eq(noticeRead.userId, currentUserId));
    
    const readMap = new Map(readRecords.map(r => [r.noticeId, r.readAt]));

    // 查询通知
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field === 'publishedAt' ? notice.publishedAt : notice.createdAt;

    let allNotices = await db.select().from(notice)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]));

    // 添加已读状态
    let noticesWithRead = allNotices.map(n => ({
      ...n,
      isRead: readMap.has(n.id),
      readAt: readMap.get(n.id)?.toISOString() || null,
    }));

    // 按已读状态过滤
    if (filter?.isRead !== undefined) {
      noticesWithRead = noticesWithRead.filter(n => n.isRead === filter.isRead);
    }

    const total = noticesWithRead.length;
    const data = noticesWithRead.slice(offset, offset + limit);

    return { data, total };
  },
});
