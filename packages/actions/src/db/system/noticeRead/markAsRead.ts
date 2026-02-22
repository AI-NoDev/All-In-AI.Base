/**
 * 标记通知为已读
 */

import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice, noticeRead, NOTICE_STATUS, NOTICE_TARGET_TYPE } from '@qiyu-allinai/db/entities/system';
import { markAsReadBodySchema } from './schemas';

export const noticeReadMarkAsRead = defineAction({
  meta: {
    name: 'system.noticeRead.markAsRead',
    displayName: '标记通知为已读',
    description: '将指定通知标记为当前用户已读',
    tags: ['system', 'noticeRead'],
    method: 'POST',
    path: '/api/system/notice-read/mark',
  },
  schemas: {
    bodySchema: markAsReadBodySchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    const { noticeId } = input;

    if (!currentUserId) {
      throw new Error('error.auth.unauthorized');
    }

    // 检查通知是否存在且已发布
    const [noticeItem] = await db.select().from(notice)
      .where(and(
        eq(notice.id, noticeId),
        eq(notice.status, NOTICE_STATUS.PUBLISHED)
      ));

    if (!noticeItem) {
      throw new Error('error.business.dataNotFound');
    }

    // 检查用户是否有权限查看该通知
    if (noticeItem.targetType === NOTICE_TARGET_TYPE.CUSTOM) {
      const targetUserIds = noticeItem.targetUserIds || [];
      if (!targetUserIds.includes(currentUserId)) {
        throw new Error('error.auth.forbidden');
      }
    }

    // 检查是否已经标记为已读
    const [existing] = await db.select().from(noticeRead)
      .where(and(
        eq(noticeRead.noticeId, noticeId),
        eq(noticeRead.userId, currentUserId)
      ));

    if (existing) {
      return { success: true };
    }

    // 插入已读记录
    await db.insert(noticeRead).values({
      noticeId,
      userId: currentUserId,
    });

    return { success: true };
  },
});
