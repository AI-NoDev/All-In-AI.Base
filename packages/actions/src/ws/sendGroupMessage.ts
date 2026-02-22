/**
 * 发送群聊消息 Action（带 WS 通知）
 * 
 * 用于外部 AI 或其他服务调用，发送消息到群聊会话。
 * 
 * 使用场景：
 * - AI Agent 在群聊中回复
 * - 群公告推送
 * - 机器人消息
 * 
 * 请求示例：
 * ```json
 * {
 *   "conversationId": "群聊会话UUID",
 *   "msgType": "01",
 *   "content": { "text": "这是一条群聊消息" },
 *   "atUserIds": ["用户UUID1", "用户UUID2"]
 * }
 * ```
 */

import { eq } from 'drizzle-orm';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import { message, conversation } from '@qiyu-allinai/db/entities/im';
import { sendGroupMessageBodySchema, sendGroupMessageOutputSchema } from './schemas';
import {
  getConversationMembers,
  getNextMessageSeq,
  updateConversationLastMessage,
  unhideConversation,
  incrementUnreadCount,
  type MessageSelect,
  type WsConnectionManager,
} from './utils';

const CHANNEL = 'im';

export const wsSendGroupMessage = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ws.message.group',
    displayName: '发送群聊消息',
    description: `发送消息到群聊会话并通过 WebSocket 实时通知在线成员。

参数说明：
- conversationId: 群聊会话 ID（必填）
- msgType: 消息类型，01=文本，02=链接，03=图片等（默认 01）
- content: 消息内容
- replyToId: 回复的消息 ID（可选）
- atUserIds: @的用户 ID 列表（可选）

使用场景：
- AI Agent 在群聊中回复
- 群公告推送
- 机器人消息

请求示例：
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "msgType": "01",
  "content": { "text": "这是一条群聊消息" },
  "atUserIds": ["user-uuid-1", "user-uuid-2"]
}`,
    tags: ['ws', 'im', 'message', 'group'],
    method: 'POST',
    path: '/api/ws/message/group',
  },
  schemas: {
    bodySchema: sendGroupMessageBodySchema,
    outputSchema: sendGroupMessageOutputSchema,
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName, wsConnectionManager } = context;
    const { conversationId, msgType, content, replyToId, atUserIds } = input;

    // 验证会话存在
    const [conv] = await db.select({ type: conversation.type })
      .from(conversation)
      .where(eq(conversation.id, conversationId))
      .limit(1);

    if (!conv) {
      throw ActionError.notFound('error.im.conversation.notFound');
    }

    // 获取群成员
    const memberIds = await getConversationMembers(db, conversationId);
    
    // 检查发送者是否是会话成员
    if (!memberIds.includes(currentUserId)) {
      throw ActionError.forbidden('error.im.conversation.notMember');
    }

    // 获取下一个消息序号
    const nextSeq = await getNextMessageSeq(db, conversationId);

    // 插入消息
    const [newMessage] = await db.insert(message).values({
      conversationId,
      senderId: currentUserId,
      msgType,
      msgSeq: nextSeq,
      content: content as typeof message.$inferInsert['content'],
      replyToId,
      atUserIds: atUserIds || [],
    }).returning();

    if (!newMessage) {
      throw ActionError.internal('error.im.message.createFailed');
    }

    // 更新会话最后消息
    await updateConversationLastMessage(db, conversationId, newMessage.id, newMessage.createdAt);

    // 取消隐藏会话
    await unhideConversation(db, conversationId, memberIds);

    // 更新其他成员的未读计数
    const otherMemberIds = memberIds.filter(id => id !== currentUserId);
    await incrementUnreadCount(db, conversationId, otherMemberIds);

    // 通过 WS 通知其他成员
    let notifiedUsers = 0;
    if (wsConnectionManager) {
      const cm = wsConnectionManager as WsConnectionManager;
      for (const memberId of otherMemberIds) {
        if (cm.isUserOnline(memberId)) {
          cm.sendToUser(memberId, {
            channel: CHANNEL,
            type: 'new_message',
            data: {
              message: newMessage,
              sender: { id: currentUserId, name: currentUserName, loginName: currentUserName },
            },
          });
          notifiedUsers++;
        }
      }
    }

    return {
      success: true,
      message: newMessage as MessageSelect,
      notifiedUsers,
    };
  },
});
