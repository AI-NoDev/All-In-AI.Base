/**
 * 发送单聊消息 Action（带 WS 通知）
 * 
 * 用于外部 AI 或其他服务调用，发送私聊消息给指定用户。
 * 如果与目标用户的单聊会话不存在，会自动创建。
 * 
 * 使用场景：
 * - AI Agent 主动联系用户
 * - 系统私信通知
 * - 客服系统集成
 * 
 * 请求示例：
 * ```json
 * {
 *   "targetUserId": "用户UUID",
 *   "msgType": "01",
 *   "content": { "text": "你好，这是一条私聊消息" }
 * }
 * ```
 */

import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import { message } from '@qiyu-allinai/db/entities/im';
import { sendPrivateMessageBodySchema, sendPrivateMessageOutputSchema } from './schemas';
import {
  findOrCreatePrivateConversation,
  getNextMessageSeq,
  updateConversationLastMessage,
  unhideConversation,
  incrementUnreadCount,
  type MessageSelect,
  type WsConnectionManager,
} from './utils';

const CHANNEL = 'im';

export const wsSendPrivateMessage = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ws.message.private',
    displayName: '发送单聊消息',
    description: `发送私聊消息给指定用户，如果会话不存在会自动创建。

参数说明：
- targetUserId: 目标用户 ID（必填）
- msgType: 消息类型，01=文本，02=链接，03=图片等（默认 01）
- content: 消息内容
- replyToId: 回复的消息 ID（可选）

使用场景：
- AI Agent 主动联系用户
- 系统私信通知
- 客服系统集成

请求示例：
{
  "targetUserId": "550e8400-e29b-41d4-a716-446655440000",
  "msgType": "01",
  "content": { "text": "你好，这是一条私聊消息" }
}

返回说明：
- isNewConversation: 是否新创建的会话
- conversationId: 会话 ID（可用于后续发送消息）`,
    tags: ['ws', 'im', 'message', 'private'],
    method: 'POST',
    path: '/api/ws/message/private',
  },
  schemas: {
    bodySchema: sendPrivateMessageBodySchema,
    outputSchema: sendPrivateMessageOutputSchema,
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName, wsConnectionManager } = context;
    const { targetUserId, msgType, content, replyToId } = input;

    // 查找或创建单聊会话
    const { conversation: conv, isNew } = await findOrCreatePrivateConversation(
      db,
      currentUserId,
      targetUserId,
      currentUserName
    );

    // 获取下一个消息序号
    const nextSeq = await getNextMessageSeq(db, conv.id);

    // 插入消息
    const [newMessage] = await db.insert(message).values({
      conversationId: conv.id,
      senderId: currentUserId,
      msgType,
      msgSeq: nextSeq,
      content: content as typeof message.$inferInsert['content'],
      replyToId,
      atUserIds: [],
    }).returning();

    if (!newMessage) {
      throw ActionError.internal('error.im.message.createFailed');
    }

    // 更新会话最后消息
    await updateConversationLastMessage(db, conv.id, newMessage.id, newMessage.createdAt);

    // 取消隐藏会话
    await unhideConversation(db, conv.id, [currentUserId, targetUserId]);

    // 更新目标用户的未读计数
    await incrementUnreadCount(db, conv.id, [targetUserId]);

    // 通过 WS 通知目标用户
    let notifiedUsers = 0;
    if (wsConnectionManager) {
      const cm = wsConnectionManager as WsConnectionManager;
      if (cm.isUserOnline(targetUserId)) {
        cm.sendToUser(targetUserId, {
          channel: CHANNEL,
          type: isNew ? 'new_conversation' : 'new_message',
          data: {
            conversation: isNew ? conv : undefined,
            message: newMessage,
            sender: { id: currentUserId, name: currentUserName, loginName: currentUserName },
          },
        });
        notifiedUsers = 1;
      }
    }

    return {
      success: true,
      conversationId: conv.id,
      message: newMessage as MessageSelect,
      isNewConversation: isNew,
      notifiedUsers,
    };
  },
});
