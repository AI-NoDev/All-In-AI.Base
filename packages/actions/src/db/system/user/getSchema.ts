/**
 * 获取用户 Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { userZodSchemas } from '@qiyu-allinai/db/entities/system';

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
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(userZodSchemas.select) as Record<string, unknown>;
  },
});
