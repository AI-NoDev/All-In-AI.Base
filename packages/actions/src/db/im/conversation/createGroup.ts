/**
 * 创建群聊会话
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { conversation, groupMember, GROUP_MEMBER_ROLES } from '@qiyu-allinai/db/entities/im';
import { actionEvents } from '../../../core/events';
import { conversationSchemas, type ConversationSelect, type ConversationInsert } from './schemas';
import { CONVERSATION_TYPE } from './utils';

export const conversationCreateGroup = defineAction({
  meta: {
    ignoreTools: true,
    name: 'im.conversation.createGroup',
    displayName: '创建群聊',
    description: '创建群聊会话并添加成员',
    tags: ['im', 'conversation'],
    method: 'POST',
    path: '/api/im/conversation/group',
  },
  schemas: {
    bodySchema: t.Object({ 
      name: t.String({ minLength: 1, maxLength: 128 }),
      memberIds: t.Array(t.String(), { minItems: 1 }),
      avatar: t.Optional(t.String()),
    }),
    outputSchema: t.Object({
      conversation: conversationSchemas.select,
      memberCount: t.Number(),
    }),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    const { name, memberIds, avatar } = input;
    
    // IM 会话无需部门权限，直接创建
    
    // 确保当前用户在成员列表中
    const allMemberIds = [...new Set([currentUserId, ...memberIds])];
    
    // 创建群聊会话
    const [newConversation] = await db.insert(conversation).values({
      type: CONVERSATION_TYPE.GROUP,
      name,
      avatar: avatar || null,
      ownerId: currentUserId,
      memberCount: allMemberIds.length,
      createdBy: currentUserName,
      createdById: currentUserId,
      updatedBy: currentUserName,
      updatedById: currentUserId,
    } as ConversationInsert).returning();
    
    if (!newConversation) {
      throw ActionError.badRequest('error.im.conversation.createFailed');
    }
    
    // 添加成员，当前用户为群主
    const memberRecords = allMemberIds.map(userId => ({
      conversationId: newConversation.id,
      userId,
      role: userId === currentUserId ? GROUP_MEMBER_ROLES.OWNER : GROUP_MEMBER_ROLES.MEMBER,
      invitedById: currentUserId,
    }));
    
    await db.insert(groupMember).values(memberRecords);
    
    // 发送群聊创建事件，通知所有成员
    actionEvents.emit('group_created', {
      conversation: {
        id: newConversation.id,
        type: newConversation.type,
        name: newConversation.name,
        avatar: newConversation.avatar,
        ownerId: newConversation.ownerId,
        memberCount: allMemberIds.length,
        createdAt: newConversation.createdAt,
      },
      memberIds: allMemberIds,
      createdBy: {
        id: currentUserId,
        name: currentUserName,
        loginName: currentUserName,
      },
    });
    
    return { 
      conversation: newConversation as ConversationSelect, 
      memberCount: allMemberIds.length,
    };
  },
});
