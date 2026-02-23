/**
 * 根据ID查询定时任务
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job, jobSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobSelect } from '@qiyu-allinai/db/entities/system/job';

export const jobGetByPk = defineAction({
  meta: {
    name: 'system.job.getByPk',
    displayName: '根据ID查询定时任务',
    description: `根据主键ID查询单个定时任务详情。`,
    tags: ['system', 'job'],
    method: 'GET',
    path: '/api/system/job/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([jobSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(job).where(eq(job.id, input.id)).limit(1);
    return (result as JobSelect) ?? null;
  },
});
