/**
 * 根据ID查询会话
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { conversation, conversationZodSchemas } from '@qiyu-allinai/db/entities/im';
import type { ConversationSelect } from './utils';

export const conversationGetByPk = defineAction({
  meta: {
    name: 'im.conversation.getByPk',
    displayName: '根据ID查询会话',
    description: '根据主键ID查询单个会话',
    tags: ['im', 'conversation'],
    method: 'GET',
    path: '/api/im/conversation/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: conversationZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // IM 会话权限基于成员关系，这里只做基本查询
    const [result] = await db.select().from(conversation)
      .where(and(eq(conversation.id, input.id), isNull(conversation.deletedAt)))
      .limit(1);
    return (result as ConversationSelect) ?? null;
  },
});
