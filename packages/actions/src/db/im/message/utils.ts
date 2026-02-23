/**
 * IM 消息模块工具函数
 */

import { eq, and } from 'drizzle-orm';
import type { DrizzleDB } from '../../../core/types';
import { message, groupMember } from '@qiyu-allinai/db/entities/im';

/**
 * 检查用户是否是会话成员
 */
export async function isConversationMember(db: DrizzleDB, conversationId: string, userId: string): Promise<boolean> {
  const [member] = await db.select({ id: groupMember.id })
    .from(groupMember)
    .where(and(
      eq(groupMember.conversationId, conversationId),
      eq(groupMember.userId, userId)
    ))
    .limit(1);
  return !!member;
}

/**
 * 检查用户是否是消息发送者
 */
export async function isMessageSender(db: DrizzleDB, messageId: string, userId: string): Promise<boolean> {
  const [msg] = await db.select({ senderId: message.senderId })
    .from(message)
    .where(eq(message.id, messageId))
    .limit(1);
  return msg?.senderId === userId;
}

/**
 * 获取消息所属会话ID
 */
export async function getMessageConversationId(db: DrizzleDB, messageId: string): Promise<string | null> {
  const [msg] = await db.select({ conversationId: message.conversationId })
    .from(message)
    .where(eq(message.id, messageId))
    .limit(1);
  return msg?.conversationId || null;
}
