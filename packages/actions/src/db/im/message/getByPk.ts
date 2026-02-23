/**
 * 根据ID查询消息
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { message } from '@qiyu-allinai/db/entities/im';
import { messageSchemas, type MessageSelect } from './schemas';
import { isConversationMember } from './utils';

export const messageGetByPk = defineAction({
  meta: {
    name: 'im.message.getByPk',
    displayName: '根据ID查询消息',
    description: '根据主键ID查询单个消息',
    tags: ['im', 'message'],
    method: 'GET',
    path: '/api/im/message/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([messageSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    
    const [result] = await db.select().from(message).where(eq(message.id, input.id)).limit(1);
    if (!result) return null;
    
    // 检查用户是否是会话成员
    const isMember = await isConversationMember(db, result.conversationId, currentUserId);
    if (!isMember) {
      throw ActionError.forbidden('error.im.conversation.notMember');
    }
    
    return result as MessageSelect;
  },
});
