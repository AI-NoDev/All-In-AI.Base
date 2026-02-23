/**
 * 创建任务日志
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { jobLog, jobLogSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobLogSelect, JobLogInsert } from '@qiyu-allinai/db/entities/system/jobLog';

export const jobLogCreate = defineAction({
  meta: {
    name: 'system.jobLog.create',
    displayName: '创建任务日志',
    description: `创建单个任务执行日志记录。`,
    tags: ['system', 'jobLog'],
    method: 'POST',
    path: '/api/system/job-log',
  },
  schemas: {
    bodySchema: t.Object({ data: jobLogSchemas.insert }),
    outputSchema: jobLogSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(jobLog).values(input.data as JobLogInsert).returning();
    return result as JobLogSelect;
  },
});
