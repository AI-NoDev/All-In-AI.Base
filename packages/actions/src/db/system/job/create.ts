/**
 * 创建定时任务
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { job, jobSchemas } from '@qiyu-allinai/db/entities/system';
import type { JobSelect, JobInsert } from '@qiyu-allinai/db/entities/system/job';

export const jobCreate = defineAction({
  meta: {
    name: 'system.job.create',
    displayName: '创建定时任务',
    description: `创建单个定时任务记录。

**必填字段：**
- name: 任务名称
- group: 任务分组
- invokeTarget: 调用目标
- cronExpression: Cron表达式`,
    tags: ['system', 'job'],
    method: 'POST',
    path: '/api/system/job',
  },
  schemas: {
    bodySchema: t.Object({ data: jobSchemas.insert }),
    outputSchema: jobSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(job).values(input.data as JobInsert).returning();
    return result as JobSelect;
  },
});
