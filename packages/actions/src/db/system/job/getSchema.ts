/**
 * 获取定时任务Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { jobSchemas } from '@qiyu-allinai/db/entities/system';

export const jobGetSchema = defineAction({
  meta: {
    name: 'system.job.getSchema',
    ignoreTools: true,
    displayName: '获取定时任务Schema',
    description: `获取定时任务表的JSON Schema定义。`,
    tags: ['system', 'job'],
    method: 'GET',
    path: '/api/system/job/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(jobSchemas.select) as Record<string, unknown>;
  },
});
