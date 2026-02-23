/**
 * 获取会话 Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { conversationSchemas } from './schemas';

export const conversationGetSchema = defineAction({
  meta: {
    name: 'im.conversation.getSchema',
    ignoreTools: true,
    displayName: '获取会话Schema',
    description: '获取会话表的JSON Schema',
    tags: ['im', 'conversation'],
    method: 'GET',
    path: '/api/im/conversation/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(conversationSchemas.select) as Record<string, unknown>;
  },
});
