/**
 * 发送消息
 */

import { t } from 'elysia';
import { eq, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { message, conversation } from '@qiyu-allinai/db/entities/im';
import { messageSchemas, type MessageSelect, type MessageInsert } from './schemas';
import { isConversationMember } from './utils';

export const messageCreate = defineAction({
  meta: {
    name: 'im.message.create',
    displayName: '发送消息',
    description: '发送单条消息',
    tags: ['im', 'message'],
    method: 'POST',
    path: '/api/im/message',
  },
  schemas: {
    bodySchema: t.Object({ data: messageSchemas.insert }),
    outputSchema: messageSchemas.select,
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    
    // 检查用户是否是会话成员
    const isMember = await isConversationMember(db, input.data.conversationId, currentUserId);
    if (!isMember) {
      throw ActionError.forbidden('error.im.conversation.notMember');
    }
    
    // Get next msgSeq for conversation
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(message).where(eq(message.conversationId, input.data.conversationId));
    const nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;
    
    const [result] = await db.insert(message).values({ ...input.data, msgSeq: nextSeq } as MessageInsert).returning();
    
    // Update conversation lastMessageAt
    if (result) {
      await db.update(conversation).set({ 
        lastMessageId: result.id, 
        lastMessageAt: result.createdAt,
        updatedAt: new Date().toISOString(),
      }).where(eq(conversation.id, input.data.conversationId));
    }
    
    return result as MessageSelect;
  },
});
