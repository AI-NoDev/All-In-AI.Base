/**
 * 创建会话
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { conversation } from '@qiyu-allinai/db/entities/im';
import { conversationSchemas, type ConversationSelect, type ConversationInsert } from './schemas';

export const conversationCreate = defineAction({
  meta: {
    name: 'im.conversation.create',
    displayName: '创建会话',
    description: '创建单个会话',
    tags: ['im', 'conversation'],
    method: 'POST',
    path: '/api/im/conversation',
  },
  schemas: {
    bodySchema: t.Object({ data: conversationSchemas.insert }),
    outputSchema: conversationSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // IM 会话无需部门权限，直接创建
    const [result] = await db.insert(conversation).values(input.data as ConversationInsert).returning();
    return result as ConversationSelect;
  },
});
