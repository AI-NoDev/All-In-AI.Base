/**
 * 获取操作日志Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { operationLogSchemas } from './schemas';

export const operationLogGetSchema = defineAction({
  meta: {
    name: 'system.operationLog.getSchema',
    ignoreTools: true,
    displayName: '获取操作日志Schema',
    description: '获取操作日志表的JSON Schema定义',
    tags: ['system', 'operationLog'],
    method: 'GET',
    path: '/api/system/operation-log/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(operationLogSchemas.select) as Record<string, unknown>;
  },
});
