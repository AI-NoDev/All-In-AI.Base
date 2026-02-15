/**
 * IM 频道处理器
 * 处理即时通讯相关的 WebSocket 消息
 */

import { eq, and, sql, inArray } from 'drizzle-orm';
import db from '@qiyu-allinai/db/connect';
import { conversation, message, groupMember, conversationRead, conversationHidden } from '@qiyu-allinai/db/entities/im';
import { actionEvents } from '@qiyu-allinai/actions';
import { connectionManager } from '../connection-manager';
import type { WsChannelHandler, WsUser } from '../types';

const CHANNEL = 'im';

// IM 消息类型
interface SendMessageData {
  conversationId: string;
  msgType: string;
  content: unknown;
  replyToId?: string;
  atUserIds?: string[];
}

interface TypingData {
  conversationId: string;
}

interface ReadData {
  conversationId: string;
  lastReadSeq: number;
}

// 获取会话成员
async function getConversationMembers(conversationId: string): Promise<string[]> {
  const members = await db
    .select({ userId: groupMember.userId })
    .from(groupMember)
    .where(eq(groupMember.conversationId, conversationId));
  return members.map(m => m.userId);
}

// 处理发送消息
async function handleSendMessage(wsId: string, user: WsUser, data: SendMessageData, requestId?: string) {
  try {
    const { conversationId, msgType, content, replyToId, atUserIds } = data;

    // 获取下一个消息序号
    const seqResult = await db
      .select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(message)
      .where(eq(message.conversationId, conversationId));
    const nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;

    // 插入消息
    const [newMessage] = await db.insert(message).values({
      conversationId,
      senderId: user.id,
      msgType,
      msgSeq: nextSeq,
      content: content as typeof message.$inferInsert['content'],
      replyToId,
      atUserIds: atUserIds || [],
    }).returning();

    // 更新会话最后消息
    await db.update(conversation).set({
      lastMessageId: newMessage.id,
      lastMessageAt: newMessage.createdAt,
      updatedAt: new Date().toISOString(),
    }).where(eq(conversation.id, conversationId));

    // 获取会话成员
    const memberIds = await getConversationMembers(conversationId);
    const otherMemberIds = memberIds.filter(id => id !== user.id);

    // 取消隐藏会话
    if (memberIds.length > 0) {
      await db.update(conversationHidden).set({
        isHidden: false,
        updatedAt: new Date().toISOString(),
      }).where(and(
        eq(conversationHidden.conversationId, conversationId),
        inArray(conversationHidden.userId, memberIds),
        eq(conversationHidden.isHidden, true)
      ));
    }

    // 更新未读计数
    for (const memberId of otherMemberIds) {
      const [existing] = await db.select().from(conversationRead)
        .where(and(
          eq(conversationRead.conversationId, conversationId),
          eq(conversationRead.userId, memberId)
        )).limit(1);

      if (existing) {
        await db.update(conversationRead).set({
          unreadCount: sql`unread_count + 1`
        }).where(and(
          eq(conversationRead.conversationId, conversationId),
          eq(conversationRead.userId, memberId)
        ));
      } else {
        await db.insert(conversationRead).values({
          conversationId,
          userId: memberId,
          lastReadSeq: 0,
          unreadCount: 1,
        });
      }
    }

    // 发送确认给发送者
    connectionManager.sendToUser(user.id, {
      channel: CHANNEL,
      type: 'message_ack',
      requestId,
      data: { success: true, message: newMessage },
    });

    // 通知其他成员
    connectionManager.sendToUsers(otherMemberIds, {
      channel: CHANNEL,
      type: 'new_message',
      data: {
        message: newMessage,
        sender: { id: user.id, name: user.name, loginName: user.loginName },
      },
    });
  } catch (error) {
    console.error('[IM] Failed to send message:', error);
    connectionManager.sendToUser(user.id, {
      channel: CHANNEL,
      type: 'message_ack',
      requestId,
      data: { success: false, error: 'Failed to send message' },
    });
  }
}

// 处理正在输入
async function handleTyping(user: WsUser, data: TypingData) {
  const { conversationId } = data;
  const memberIds = await getConversationMembers(conversationId);
  const otherMemberIds = memberIds.filter(id => id !== user.id);

  connectionManager.sendToUsers(otherMemberIds, {
    channel: CHANNEL,
    type: 'typing',
    data: {
      conversationId,
      userId: user.id,
      userName: user.name || user.loginName,
    },
  });
}

// 处理已读
async function handleRead(user: WsUser, data: ReadData) {
  const { conversationId, lastReadSeq } = data;

  const [existing] = await db.select().from(conversationRead)
    .where(and(
      eq(conversationRead.conversationId, conversationId),
      eq(conversationRead.userId, user.id)
    )).limit(1);

  if (existing) {
    await db.update(conversationRead).set({
      lastReadSeq,
      lastReadAt: new Date().toISOString(),
      unreadCount: 0,
    }).where(and(
      eq(conversationRead.conversationId, conversationId),
      eq(conversationRead.userId, user.id)
    ));
  } else {
    await db.insert(conversationRead).values({
      conversationId,
      userId: user.id,
      lastReadSeq,
      unreadCount: 0,
    });
  }

  const memberIds = await getConversationMembers(conversationId);
  const otherMemberIds = memberIds.filter(id => id !== user.id);

  connectionManager.sendToUsers(otherMemberIds, {
    channel: CHANNEL,
    type: 'read',
    data: { conversationId, userId: user.id, lastReadSeq },
  });
}

// IM 频道处理器
export const imChannelHandler: WsChannelHandler = {
  channel: CHANNEL,

  onMessage: async (wsId, user, type, data, requestId) => {
    switch (type) {
      case 'message':
        await handleSendMessage(wsId, user, data as SendMessageData, requestId);
        break;
      case 'typing':
        await handleTyping(user, data as TypingData);
        break;
      case 'read':
        await handleRead(user, data as ReadData);
        break;
      default:
        connectionManager.sendToUser(user.id, {
          channel: CHANNEL,
          type: 'error',
          data: { message: `Unknown IM message type: ${type}` },
        });
    }
  },

  onSubscribe: (wsId, user) => {
    // 广播用户上线
    connectionManager.broadcast({
      channel: CHANNEL,
      type: 'online',
      data: { userId: user.id, userName: user.name || user.loginName },
    }, user.id);
  },

  onDisconnect: (wsId, user) => {
    // 检查用户是否还有其他连接订阅了 IM
    if (!connectionManager.isUserOnline(user.id)) {
      connectionManager.broadcast({
        channel: CHANNEL,
        type: 'offline',
        data: { userId: user.id, userName: user.name || user.loginName },
      });
    }
  },
};

// 订阅 Action 事件
actionEvents.on('group_created', (data) => {
  connectionManager.sendToUsers(data.memberIds, {
    channel: CHANNEL,
    type: 'group_created',
    data,
  });
});

actionEvents.on('group_dissolved', (data) => {
  connectionManager.sendToUsers(data.memberIds, {
    channel: CHANNEL,
    type: 'group_dissolved',
    data,
  });
});

actionEvents.on('message_recalled', (data) => {
  connectionManager.sendToUsers(data.memberIds, {
    channel: CHANNEL,
    type: 'message_recalled',
    data,
  });
});
