/**
 * 撤回通知
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice, noticeTypeboxSchemas, NOTICE_STATUS } from '@qiyu-allinai/db/entities/system';

export const noticeWithdraw = defineAction({
  meta: {
    name: 'system.notice.withdraw',
    displayName: '撤回通知',
    description: '撤回已发布的通知，撤回后用户不可见',
    tags: ['system', 'notice'],
    method: 'POST',
    path: '/api/system/notice/:id/withdraw',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String({ format: 'uuid', description: '通知ID' }) }),
    outputSchema: noticeTypeboxSchemas.select,
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

    // 检查状态是否为已发布
    if (existing.status !== NOTICE_STATUS.PUBLISHED) {
      throw new Error('error.notice.cannotWithdraw');
    }

    // 更新状态为已撤回
    const [result] = await db.update(notice)
      .set({
        status: NOTICE_STATUS.WITHDRAWN,
        updatedBy: currentUserName,
      })
      .where(eq(notice.id, id))
      .returning();

    return result;
  },
});
