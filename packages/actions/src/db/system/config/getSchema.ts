/**
 * 获取系统配置Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { configSchemas } from '@qiyu-allinai/db/entities/system';

export const configGetSchema = defineAction({
  meta: {
    name: 'system.config.getSchema',
    ignoreTools: true,
    displayName: '获取系统配置Schema',
    description: '获取系统配置表的JSON Schema定义。',
    tags: ['system', 'config'],
    method: 'GET',
    path: '/api/system/config/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(configSchemas.select) as Record<string, unknown>;
  },
});
