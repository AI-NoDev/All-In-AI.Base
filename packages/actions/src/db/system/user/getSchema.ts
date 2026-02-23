/**
 * 获取用户 Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { userSchemas } from '@qiyu-allinai/db/entities/system';

export const userGetSchema = defineAction({
  meta: {
    name: 'system.user.getSchema',
    ignoreTools: true,
    displayName: '获取用户Schema',
    description: '获取用户表的JSON Schema',
    tags: ['system', 'user'],
    method: 'GET',
    path: '/api/system/user/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(userSchemas.select) as Record<string, unknown>;
  },
});
