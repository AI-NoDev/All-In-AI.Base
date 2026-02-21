/**
 * 获取消息 Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { messageZodSchemas } from '@qiyu-allinai/db/entities/im';

export const messageGetSchema = defineAction({
  meta: {
    name: 'im.message.getSchema',
    ignoreTools: true,
    displayName: '获取消息Schema',
    description: '获取消息表的JSON Schema',
    tags: ['im', 'message'],
    method: 'GET',
    path: '/api/im/message/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(messageZodSchemas.select) as Record<string, unknown>;
  },
});
