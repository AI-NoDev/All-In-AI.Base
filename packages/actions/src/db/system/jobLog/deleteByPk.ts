/**
 * 删除任务日志
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog } from '@qiyu-allinai/db/entities/system';

export const jobLogDeleteByPk = defineAction({
  meta: {
    name: 'system.jobLog.deleteByPk',
    displayName: '删除任务日志',
    description: `根据ID物理删除任务执行日志。`,
    tags: ['system', 'jobLog'],
    method: 'DELETE',
    path: '/api/system/job-log/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(jobLog).where(eq(jobLog.id, input.id)).returning();
    return !!result;
  },
});
