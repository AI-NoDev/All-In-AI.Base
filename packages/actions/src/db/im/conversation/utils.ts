/**
 * IM 会话模块工具函数
 */

import { eq, and, isNull } from 'drizzle-orm';
import type { DrizzleDB } from '../../../core/types';
import { conversation } from '@qiyu-allinai/db/entities/im';
import { user } from '@qiyu-allinai/db/entities/system';

/** 会话类型常量 */
export const CONVERSATION_TYPE = {
  PRIVATE: '1',
  GROUP: '2',
} as const;

/**
 * 通过会话创建者ID获取部门ID
 */
export async function getDeptIdByCreator(db: DrizzleDB, creatorId: string): Promise<string | null> {
  const [creator] = await db.select({ deptId: user.deptId })
    .from(user)
    .where(and(eq(user.id, creatorId), isNull(user.deletedAt)))
    .limit(1);
  return creator?.deptId || null;
}

/**
 * 通过会话ID获取创建者的部门ID
 */
export async function getDeptIdByConversationId(db: DrizzleDB, conversationId: string): Promise<string | null> {
  const [target] = await db.select({ createdById: conversation.createdById })
    .from(conversation)
    .where(and(eq(conversation.id, conversationId), isNull(conversation.deletedAt)))
    .limit(1);
  
  if (!target?.createdById) return null;
  return getDeptIdByCreator(db, target.createdById);
}

/**
 * 检查用户是否是会话成员
 */
export async function isConversationMember(db: DrizzleDB, conversationId: string, userId: string): Promise<boolean> {
  const { groupMember } = await import('@qiyu-allinai/db/entities/im');
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
 * 检查用户是否是会话群主
 */
export async function isConversationOwner(db: DrizzleDB, conversationId: string, userId: string): Promise<boolean> {
  const [conv] = await db.select({ ownerId: conversation.ownerId })
    .from(conversation)
    .where(and(eq(conversation.id, conversationId), isNull(conversation.deletedAt)))
    .limit(1);
  return conv?.ownerId === userId;
}
