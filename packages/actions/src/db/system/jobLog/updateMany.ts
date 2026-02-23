/**
 * 批量更新任务日志
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog, jobLogSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobLogSelect, JobLogInsert } from '@qiyu-allinai/db/entities/system/jobLog';

export const jobLogUpdateMany = defineAction({
  meta: {
    name: 'system.jobLog.updateMany',
    ignoreTools: true,
    displayName: '批量更新任务日志',
    description: `根据ID列表批量更新任务执行日志。`,
    tags: ['system', 'jobLog'],
    method: 'PUT',
    path: '/api/system/job-log/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: jobLogSchemas.update }),
    outputSchema: t.Array(jobLogSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: JobLogSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(jobLog)
        .set(input.data as Partial<JobLogInsert>)
        .where(eq(jobLog.id, id))
        .returning();
      if (result) results.push(result as JobLogSelect);
    }
    return results;
  },
});
