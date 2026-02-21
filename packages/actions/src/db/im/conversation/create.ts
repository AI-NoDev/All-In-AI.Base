/**
 * 创建会话
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { conversation, conversationZodSchemas } from '@qiyu-allinai/db/entities/im';
import type { ConversationSelect, ConversationInsert } from './utils';

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
    bodySchema: z.object({ data: conversationZodSchemas.insert }),
    outputSchema: conversationZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // IM 会话无需部门权限，直接创建
    const [result] = await db.insert(conversation).values(input.data as ConversationInsert).returning();
    return result as ConversationSelect;
  },
});
