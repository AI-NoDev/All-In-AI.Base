/**
 * 批量更新定时任务
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job, jobSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobSelect, JobInsert } from '@qiyu-allinai/db/entities/system/job';

export const jobUpdateMany = defineAction({
  meta: {
    name: 'system.job.updateMany',
    ignoreTools: true,
    displayName: '批量更新定时任务',
    description: `根据ID列表批量更新定时任务。`,
    tags: ['system', 'job'],
    method: 'PUT',
    path: '/api/system/job/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: jobSchemas.update }),
    outputSchema: t.Array(jobSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: JobSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(job)
        .set(input.data as Partial<JobInsert>)
        .where(eq(job.id, id))
        .returning();
      if (result) results.push(result as JobSelect);
    }
    return results;
  },
});
