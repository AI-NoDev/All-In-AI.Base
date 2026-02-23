/**
 * 获取岗位Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { postSchemas } from './schemas';

export const postGetSchema = defineAction({
  meta: {
    name: 'system.post.getSchema',
    ignoreTools: true,
    displayName: '获取岗位Schema',
    description: '获取岗位表的JSON Schema定义',
    tags: ['system', 'post'],
    method: 'GET',
    path: '/api/system/post/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(postSchemas.select) as Record<string, unknown>;
  },
});
