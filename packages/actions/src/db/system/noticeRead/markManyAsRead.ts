/**
 * 批量标记通知为已读
 */

import { z } from 'zod';
import { eq, and, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice, noticeRead, NOTICE_STATUS, NOTICE_TARGET_TYPE } from '@qiyu-allinai/db/entities/system';
import { markManyAsReadBodySchema } from './schemas';

export const noticeReadMarkManyAsRead = defineAction({
  meta: {
    name: 'system.noticeRead.markManyAsRead',
    displayName: '批量标记通知为已读',
    description: '将多个通知标记为当前用户已读',
    tags: ['system', 'noticeRead'],
    method: 'POST',
    path: '/api/system/notice-read/mark-many',
  },
  schemas: {
    bodySchema: markManyAsReadBodySchema,
    outputSchema: z.object({ success: z.boolean(), count: z.number() }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    const { noticeIds } = input;

    if (!currentUserId) {
      throw new Error('error.auth.unauthorized');
    }

    if (noticeIds.length === 0) {
      return { success: true, count: 0 };
    }

    // 获取所有已发布的通知
    const notices = await db.select().from(notice)
      .where(and(
        inArray(notice.id, noticeIds),
        eq(notice.status, NOTICE_STATUS.PUBLISHED)
      ));

    // 过滤出用户有权限查看的通知
    const accessibleNoticeIds = notices
      .filter(n => {
        if (n.targetType === NOTICE_TARGET_TYPE.ALL) return true;
        const targetUserIds = n.targetUserIds || [];
        return targetUserIds.includes(currentUserId);
      })
      .map(n => n.id);

    if (accessibleNoticeIds.length === 0) {
      return { success: true, count: 0 };
    }

    // 获取已经标记为已读的记录
    const existingReads = await db.select().from(noticeRead)
      .where(and(
        inArray(noticeRead.noticeId, accessibleNoticeIds),
        eq(noticeRead.userId, currentUserId)
      ));

    const existingNoticeIds = new Set(existingReads.map(r => r.noticeId));
    const newNoticeIds = accessibleNoticeIds.filter(id => !existingNoticeIds.has(id));

    if (newNoticeIds.length === 0) {
      return { success: true, count: 0 };
    }

    // 批量插入已读记录
    await db.insert(noticeRead).values(
      newNoticeIds.map(noticeId => ({
        noticeId,
        userId: currentUserId,
      }))
    );

    return { success: true, count: newNoticeIds.length };
  },
});
