/**
 * 批量创建定时任务
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { job, jobSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobSelect, JobInsert } from '@qiyu-allinai/db/entities/system/job';

export const jobCreateMany = defineAction({
  meta: {
    name: 'system.job.createMany',
    ignoreTools: true,
    displayName: '批量创建定时任务',
    description: `批量创建多个定时任务记录。`,
    tags: ['system', 'job'],
    method: 'POST',
    path: '/api/system/job/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(jobSchemas.insert) }),
    outputSchema: t.Array(jobSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(job).values(input.data as JobInsert[]).returning();
    return results as JobSelect[];
  },
});
