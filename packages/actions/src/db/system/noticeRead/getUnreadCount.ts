/**
 * 获取当前用户未读通知数量
 */

import { eq, and, sql, notInArray, or, arrayContains } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice, noticeRead, NOTICE_STATUS, NOTICE_TARGET_TYPE } from '@qiyu-allinai/db/entities/system';
import { unreadCountOutputSchema } from './schemas';

export const noticeReadGetUnreadCount = defineAction({
  meta: {
    name: 'system.noticeRead.getUnreadCount',
    displayName: '获取未读通知数量',
    description: '获取当前用户的未读通知数量',
    tags: ['system', 'noticeRead'],
    method: 'GET',
    path: '/api/system/notice-read/unread-count',
  },
  schemas: {
    outputSchema: unreadCountOutputSchema,
  },
  execute: async (_input, context) => {
    const { db, currentUserId } = context;

    if (!currentUserId) {
      throw new Error('error.auth.unauthorized');
    }

    // 获取用户已读的通知 ID 列表
    const readRecords = await db.select({ noticeId: noticeRead.noticeId })
      .from(noticeRead)
      .where(eq(noticeRead.userId, currentUserId));

    const readNoticeIds = readRecords.map(r => r.noticeId);

    // 构建查询条件：已发布 + (全部用户 或 包含当前用户) + 未读
    const conditions = [
      eq(notice.status, NOTICE_STATUS.PUBLISHED),
      or(
        eq(notice.targetType, NOTICE_TARGET_TYPE.ALL),
        arrayContains(notice.targetUserIds, [currentUserId])
      ),
    ];

    if (readNoticeIds.length > 0) {
      conditions.push(notInArray(notice.id, readNoticeIds));
    }

    const [result] = await db.select({ count: sql<number>`count(*)` })
      .from(notice)
      .where(and(...conditions));

    return { count: Number(result?.count ?? 0) };
  },
});
