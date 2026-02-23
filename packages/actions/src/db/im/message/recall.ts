/**
 * 撤回消息
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { message, groupMember } from '@qiyu-allinai/db/entities/im';
import { actionEvents } from '../../../core/events';
import { messageSchemas, type MessageSelect } from './schemas';

export const messageRecall = defineAction({
  meta: {
    name: 'im.message.recall',
    displayName: '撤回消息',
    description: '撤回指定消息',
    tags: ['im', 'message'],
    method: 'PUT',
    path: '/api/im/message/:id/recall',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: messageSchemas.select,
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    
    // 获取消息信息
    const [msg] = await db.select().from(message).where(eq(message.id, input.id)).limit(1);
    if (!msg) {
      throw ActionError.notFound('error.im.message.notFound');
    }
    
    // 只有发送者可以撤回消息
    if (msg.senderId !== currentUserId) {
      throw ActionError.forbidden('error.im.message.notSender');
    }
    
    // 更新消息为已撤回
    const [result] = await db.update(message).set({ 
      isRecalled: true, 
      recalledAt: new Date().toISOString(),
      recalledById: currentUserId,
    }).where(eq(message.id, input.id)).returning();
    
    // 获取会话成员
    const members = await db.select({ userId: groupMember.userId })
      .from(groupMember)
      .where(eq(groupMember.conversationId, msg.conversationId));
    const memberIds = members.map(m => m.userId);
    
    // 广播撤回事件
    actionEvents.emit('message_recalled', {
      messageId: input.id,
      conversationId: msg.conversationId,
      msgSeq: msg.msgSeq,
      memberIds,
      recalledBy: {
        id: currentUserId,
        name: currentUserName,
        loginName: currentUserName,
      },
    });
    
    return result as MessageSelect;
  },
});
