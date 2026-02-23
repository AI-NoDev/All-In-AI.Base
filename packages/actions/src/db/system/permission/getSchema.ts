/**
 * 获取权限Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { permissionSchemas } from './schemas';

export const permissionGetSchema = defineAction({
  meta: {
    name: 'system.permission.getSchema',
    ignoreTools: true,
    displayName: '获取权限Schema',
    description: '获取权限表的JSON Schema定义',
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(permissionSchemas.select) as Record<string, unknown>;
  },
});
