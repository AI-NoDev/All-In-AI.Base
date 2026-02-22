/**
 * 发布通知
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice, NOTICE_STATUS } from '@qiyu-allinai/db/entities/system';
import { noticeZodSchemas } from './schemas';

export const noticePublish = defineAction({
  meta: {
    name: 'system.notice.publish',
    displayName: '发布通知',
    description: '将草稿状态的通知发布，发布后用户可见',
    tags: ['system', 'notice'],
    method: 'POST',
    path: '/api/system/notice/:id/publish',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string().uuid().describe('通知 ID') }),
    outputSchema: noticeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    const { id } = input;

    if (!currentUserId) {
      throw new Error('error.auth.unauthorized');
    }

    // 检查通知是否存在
    const [existing] = await db.select().from(notice).where(eq(notice.id, id));
    if (!existing) {
      throw new Error('error.business.dataNotFound');
    }

    // 检查状态是否为草稿
    if (existing.status !== NOTICE_STATUS.DRAFT) {
      throw new Error('error.notice.cannotPublish');
    }

    // 更新状态为已发布
    const [result] = await db.update(notice)
      .set({
        status: NOTICE_STATUS.PUBLISHED,
        publishedAt: new Date(),
        updatedBy: currentUserName,
      })
      .where(eq(notice.id, id))
      .returning();

    return result;
  },
});
