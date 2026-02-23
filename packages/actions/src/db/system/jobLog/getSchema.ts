/**
 * 获取任务日志Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { jobLogSchemas } from '@qiyu-allinai/db/entities/system';

export const jobLogGetSchema = defineAction({
  meta: {
    name: 'system.jobLog.getSchema',
    ignoreTools: true,
    displayName: '获取任务日志Schema',
    description: `获取任务日志表的JSON Schema定义。`,
    tags: ['system', 'jobLog'],
    method: 'GET',
    path: '/api/system/job-log/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(jobLogSchemas.select) as Record<string, unknown>;
  },
});
