/**
 * 批量创建任务日志
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { jobLog, jobLogSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobLogSelect, JobLogInsert } from '@qiyu-allinai/db/entities/system/jobLog';

export const jobLogCreateMany = defineAction({
  meta: {
    name: 'system.jobLog.createMany',
    ignoreTools: true,
    displayName: '批量创建任务日志',
    description: `批量创建多个任务执行日志记录。`,
    tags: ['system', 'jobLog'],
    method: 'POST',
    path: '/api/system/job-log/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(jobLogSchemas.insert) }),
    outputSchema: t.Array(jobLogSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(jobLog).values(input.data as JobLogInsert[]).returning();
    return results as JobLogSelect[];
  },
});
