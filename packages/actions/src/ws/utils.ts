/**
 * WS Actions 工具函数
 * 
 * 提供 WebSocket 通知相关的工具函数。
 * 注意：这些函数需要在 server 端注入 connectionManager 实例。
 */

import { eq, and, sql, inArray } from 'drizzle-orm';
import type { DrizzleDB } from '../core/types';
import { message, conversation, groupMember, conversationRead, conversationHidden } from '@qiyu-allinai/db/entities/im';

/** 消息类型定义 */
export type MessageSelect = typeof message.$inferSelect;
export type MessageInsert = typeof message.$inferInsert;
export type ConversationSelect = typeof conversation.$inferSelect;

/** 发送者信息 */
export interface SenderInfo {
  id: string;
  name: string;
  loginName: string;
}

/** WS 连接管理器接口 */
export interface WsConnectionManager {
  isUserOnline(userId: string): boolean;
  getOnlineUsers(): string[];
  sendToUser(userId: string, message: WsMessage): void;
  sendToUsers(userIds: string[], message: WsMessage): void;
  broadcast(message: WsMessage, excludeUserId?: string): void;
}

/** WS 消息结构 */
export interface WsMessage {
  channel: string;
  type: string;
  data?: unknown;
  requestId?: string;
}

/**
 * 获取会话成员 ID 列表
 */
export async function getConversationMembers(db: DrizzleDB, conversationId: string): Promise<string[]> {
  const members = await db
    .select({ userId: groupMember.userId })
    .from(groupMember)
    .where(eq(groupMember.conversationId, conversationId));
  return members.map(m => m.userId);
}

/**
 * 获取下一个消息序号
 */
export async function getNextMessageSeq(db: DrizzleDB, conversationId: string): Promise<number> {
  const seqResult = await db
    .select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
    .from(message)
    .where(eq(message.conversationId, conversationId));
  return (seqResult[0]?.maxSeq ?? 0) + 1;
}

/**
 * 更新会话最后消息
 */
export async function updateConversationLastMessage(
  db: DrizzleDB,
  conversationId: string,
  messageId: string,
  createdAt: string
): Promise<void> {
  await db.update(conversation).set({
    lastMessageId: messageId,
    lastMessageAt: createdAt,
    updatedAt: new Date().toISOString(),
  }).where(eq(conversation.id, conversationId));
}

/**
 * 取消隐藏会话
 */
export async function unhideConversation(
  db: DrizzleDB,
  conversationId: string,
  memberIds: string[]
): Promise<void> {
  if (memberIds.length === 0) return;
  
  await db.update(conversationHidden).set({
    isHidden: false,
    updatedAt: new Date().toISOString(),
  }).where(and(
    eq(conversationHidden.conversationId, conversationId),
    inArray(conversationHidden.userId, memberIds),
    eq(conversationHidden.isHidden, true)
  ));
}

/**
 * 更新用户未读计数
 */
export async function incrementUnreadCount(
  db: DrizzleDB,
  conversationId: string,
  userIds: string[]
): Promise<void> {
  for (const userId of userIds) {
    const [existing] = await db.select().from(conversationRead)
      .where(and(
        eq(conversationRead.conversationId, conversationId),
        eq(conversationRead.userId, userId)
      )).limit(1);

    if (existing) {
      await db.update(conversationRead).set({
        unreadCount: sql`unread_count + 1`
      }).where(and(
        eq(conversationRead.conversationId, conversationId),
        eq(conversationRead.userId, userId)
      ));
    } else {
      await db.insert(conversationRead).values({
        conversationId,
        userId,
        lastReadSeq: 0,
        unreadCount: 1,
      });
    }
  }
}

/**
 * 查找或创建单聊会话
 */
export async function findOrCreatePrivateConversation(
  db: DrizzleDB,
  userId1: string,
  userId2: string,
  creatorName: string
): Promise<{ conversation: ConversationSelect; isNew: boolean }> {
  // 查找现有的单聊会话（type='01' 表示单聊）
  const existingConversations = await db
    .select({ id: conversation.id })
    .from(conversation)
    .where(eq(conversation.type, '01'));

  // 检查每个单聊会话的成员
  for (const conv of existingConversations) {
    const members = await db
      .select({ userId: groupMember.userId })
      .from(groupMember)
      .where(eq(groupMember.conversationId, conv.id));
    
    const memberIds = members.map(m => m.userId);
    if (memberIds.length === 2 && memberIds.includes(userId1) && memberIds.includes(userId2)) {
      const [fullConv] = await db.select().from(conversation).where(eq(conversation.id, conv.id));
      return { conversation: fullConv as ConversationSelect, isNew: false };
    }
  }

  // 创建新的单聊会话
  const [newConversation] = await db.insert(conversation).values({
    type: '01',
    name: null,
    createdBy: creatorName,
    updatedBy: creatorName,
  }).returning();

  if (!newConversation) {
    throw new Error('error.im.conversation.createFailed');
  }

  // 添加两个成员
  await db.insert(groupMember).values([
    { conversationId: newConversation.id, userId: userId1, role: 'member' },
    { conversationId: newConversation.id, userId: userId2, role: 'member' },
  ]);

  return { conversation: newConversation as ConversationSelect, isNew: true };
}
