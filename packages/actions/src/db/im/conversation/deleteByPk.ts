/**
 * 删除会话
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { conversation } from '@qiyu-allinai/db/entities/im';
import { isConversationOwner } from './utils';

export const conversationDeleteByPk = defineAction({
  meta: {
    name: 'im.conversation.deleteByPk',
    displayName: '删除会话',
    description: '根据ID软删除会话',
    tags: ['im', 'conversation'],
    method: 'DELETE',
    path: '/api/im/conversation/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    
    // IM 权限基于成员关系：只有群主可以删除会话
    const isOwner = await isConversationOwner(db, input.id, currentUserId);
    if (!isOwner) {
      throw ActionError.forbidden('error.im.conversation.notOwner');
    }
    
    const [result] = await db.update(conversation).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: currentUserId,
      deletedBy: currentUserName,
    }).where(and(eq(conversation.id, input.id), isNull(conversation.deletedAt))).returning();
    
    return !!result;
  },
});
