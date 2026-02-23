/**
 * 查找或创建私聊会话
 */

import { t } from 'elysia';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { conversation, groupMember, conversationHidden } from '@qiyu-allinai/db/entities/im';
import { conversationSchemas, type ConversationSelect, type ConversationInsert } from './schemas';
import { CONVERSATION_TYPE } from './utils';

export const conversationFindOrCreatePrivate = defineAction({
  meta: {
    ignoreTools: true,
    name: 'im.conversation.findOrCreatePrivate',
    displayName: '查找或创建私聊',
    description: '查找两个用户之间的私聊会话，如果不存在则创建',
    tags: ['im', 'conversation'],
    method: 'POST',
    path: '/api/im/conversation/private',
  },
  schemas: {
    bodySchema: t.Object({ 
      targetUserId: t.String(),
      targetUserName: t.Optional(t.String()),
    }),
    outputSchema: t.Object({
      conversation: conversationSchemas.select,
      isNew: t.Boolean(),
    }),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    const { targetUserId, targetUserName } = input;
    
    // IM 会话无需部门权限，直接处理
    
    // 查找现有的私聊会话（type='1'表示私聊）
    const existingConversations = await db
      .select({ conversationId: groupMember.conversationId })
      .from(groupMember)
      .where(eq(groupMember.userId, currentUserId));
    
    const currentUserConvIds = existingConversations.map(c => c.conversationId);
    
    if (currentUserConvIds.length > 0) {
      // 查找目标用户也在的私聊会话
      const targetUserConversations = await db
        .select({ conversationId: groupMember.conversationId })
        .from(groupMember)
        .where(and(
          eq(groupMember.userId, targetUserId),
          inArray(groupMember.conversationId, currentUserConvIds)
        ));
      
      if (targetUserConversations.length > 0) {
        // 检查这些会话中是否有私聊类型的
        const privateConvs = await db
          .select()
          .from(conversation)
          .where(and(
            inArray(conversation.id, targetUserConversations.map(c => c.conversationId)),
            eq(conversation.type, CONVERSATION_TYPE.PRIVATE),
            isNull(conversation.deletedAt)
          ))
          .limit(1);
        
        if (privateConvs.length > 0) {
          const existingConv = privateConvs[0];
          
          // 取消隐藏（如果被当前用户隐藏了）
          await db.update(conversationHidden).set({
            isHidden: false,
            updatedAt: new Date().toISOString(),
          }).where(and(
            eq(conversationHidden.conversationId, existingConv.id),
            eq(conversationHidden.userId, currentUserId),
            eq(conversationHidden.isHidden, true)
          ));
          
          return { conversation: existingConv as ConversationSelect, isNew: false };
        }
      }
    }
    
    // 创建新的私聊会话
    const [newConversation] = await db.insert(conversation).values({
      type: CONVERSATION_TYPE.PRIVATE,
      name: targetUserName || null,
      ownerId: currentUserId,
      memberCount: 2,
      createdBy: currentUserName,
      createdById: currentUserId,
      updatedBy: currentUserName,
      updatedById: currentUserId,
    } as ConversationInsert).returning();
    
    if (!newConversation) {
      throw ActionError.badRequest('error.im.conversation.createFailed');
    }
    
    // 添加两个成员
    await db.insert(groupMember).values([
      { conversationId: newConversation.id, userId: currentUserId, role: '0' },
      { conversationId: newConversation.id, userId: targetUserId, role: '0' },
    ]);
    
    return { conversation: newConversation as ConversationSelect, isNew: true };
  },
});
