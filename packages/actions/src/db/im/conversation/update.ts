/**
 * 更新会话
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { conversation } from '@qiyu-allinai/db/entities/im';
import { conversationSchemas, type ConversationSelect, type ConversationInsert } from './schemas';
import { isConversationMember } from './utils';

export const conversationUpdate = defineAction({
  meta: {
    name: 'im.conversation.update',
    displayName: '更新会话',
    description: '根据ID更新单个会话',
    tags: ['im', 'conversation'],
    method: 'PUT',
    path: '/api/im/conversation/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: conversationSchemas.update }),
    outputSchema: conversationSchemas.select,
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    
    // IM 权限基于成员关系：只有会话成员可以更新
    const isMember = await isConversationMember(db, input.id, currentUserId);
    if (!isMember) {
      throw ActionError.forbidden('error.im.conversation.notMember');
    }
    
    const [result] = await db.update(conversation)
      .set(input.data as Partial<ConversationInsert>)
      .where(and(eq(conversation.id, input.id), isNull(conversation.deletedAt)))
      .returning();
    
    if (!result) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    return result as ConversationSelect;
  },
});
