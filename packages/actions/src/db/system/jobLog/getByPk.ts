/**
 * 根据ID查询任务日志
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog, jobLogSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobLogSelect } from '@qiyu-allinai/db/entities/system/jobLog';

export const jobLogGetByPk = defineAction({
  meta: {
    name: 'system.jobLog.getByPk',
    displayName: '根据ID查询任务日志',
    description: `根据主键ID查询单个任务执行日志详情。`,
    tags: ['system', 'jobLog'],
    method: 'GET',
    path: '/api/system/job-log/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([jobLogSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(jobLog).where(eq(jobLog.id, input.id)).limit(1);
    return (result as JobLogSelect) ?? null;
  },
});
