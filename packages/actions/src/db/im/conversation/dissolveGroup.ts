/**
 * 解散群聊
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { conversation, groupMember, CONVERSATION_STATUS } from '@qiyu-allinai/db/entities/im';
import { actionEvents } from '../../../core/events';
import { CONVERSATION_TYPE } from './utils';

export const conversationDissolveGroup = defineAction({
  meta: {
    name: 'im.conversation.dissolveGroup',
    displayName: '解散群聊',
    description: '解散群聊（仅群主可操作）',
    tags: ['im', 'conversation'],
    method: 'POST',
    path: '/api/im/conversation/:id/dissolve',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    const { id: conversationId } = input;
    
    // 检查会话是否存在且为群聊
    const [conv] = await db.select().from(conversation)
      .where(and(eq(conversation.id, conversationId), isNull(conversation.deletedAt)))
      .limit(1);
    
    if (!conv) {
      throw ActionError.notFound('error.im.conversation.notFound');
    }
    
    if (conv.type !== CONVERSATION_TYPE.GROUP) {
      throw ActionError.badRequest('error.im.conversation.notGroup');
    }
    
    // 检查是否为群主（IM 权限基于成员关系，只有群主可以解散）
    if (conv.ownerId !== currentUserId) {
      throw ActionError.forbidden('error.im.conversation.notOwner');
    }
    
    // 获取所有成员ID
    const members = await db.select({ userId: groupMember.userId })
      .from(groupMember)
      .where(eq(groupMember.conversationId, conversationId));
    const memberIds = members.map(m => m.userId);
    
    // 更新会话状态为已解散
    await db.update(conversation).set({
      status: CONVERSATION_STATUS.DISSOLVED,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUserName,
      updatedById: currentUserId,
    }).where(eq(conversation.id, conversationId));
    
    // 发送群聊解散事件
    actionEvents.emit('group_dissolved', {
      conversationId,
      memberIds,
      dissolvedBy: {
        id: currentUserId,
        name: currentUserName,
        loginName: currentUserName,
      },
    });
    
    return true;
  },
});
