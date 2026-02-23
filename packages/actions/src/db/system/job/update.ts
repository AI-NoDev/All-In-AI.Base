/**
 * 更新定时任务
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job, jobSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobSelect, JobInsert } from '@qiyu-allinai/db/entities/system/job';

export const jobUpdate = defineAction({
  meta: {
    name: 'system.job.update',
    displayName: '更新定时任务',
    description: `根据ID更新单个定时任务信息。`,
    tags: ['system', 'job'],
    method: 'PUT',
    path: '/api/system/job/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: jobSchemas.update }),
    outputSchema: jobSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(job)
      .set(input.data as Partial<JobInsert>)
      .where(eq(job.id, input.id))
      .returning();
    return result as JobSelect;
  },
});
