/**
 * 获取会话 Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { conversationZodSchemas } from '@qiyu-allinai/db/entities/im';

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
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(conversationZodSchemas.select) as Record<string, unknown>;
  },
});
