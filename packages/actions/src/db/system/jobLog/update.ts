/**
 * 更新任务日志
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog, jobLogSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobLogSelect, JobLogInsert } from '@qiyu-allinai/db/entities/system/jobLog';

export const jobLogUpdate = defineAction({
  meta: {
    name: 'system.jobLog.update',
    displayName: '更新任务日志',
    description: `根据ID更新单个任务执行日志信息。`,
    tags: ['system', 'jobLog'],
    method: 'PUT',
    path: '/api/system/job-log/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: jobLogSchemas.update }),
    outputSchema: jobLogSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(jobLog)
      .set(input.data as Partial<JobLogInsert>)
      .where(eq(jobLog.id, input.id))
      .returning();
    return result as JobLogSelect;
  },
});
