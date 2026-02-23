/**
 * 获取消息 Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { messageSchemas } from './schemas';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(messageSchemas.select) as Record<string, unknown>;
  },
});
