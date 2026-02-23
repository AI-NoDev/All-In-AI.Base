/**
 * 删除定时任务
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job } from '@qiyu-allinai/db/entities/system';

export const jobDeleteByPk = defineAction({
  meta: {
    name: 'system.job.deleteByPk',
    displayName: '删除定时任务',
    description: `根据ID物理删除定时任务（永久删除，不可恢复）。`,
    tags: ['system', 'job'],
    method: 'DELETE',
    path: '/api/system/job/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(job).where(eq(job.id, input.id)).returning();
    return !!result;
  },
});
