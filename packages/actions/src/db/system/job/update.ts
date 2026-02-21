/**
 * 更新定时任务
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job } from '@qiyu-allinai/db/entities/system';
import { jobZodSchemas } from './schemas';
import type { JobSelect, JobInsert } from './utils';

export const jobUpdate = defineAction({
  meta: {
    name: 'system.job.update',
    displayName: '更新定时任务',
    description: `根据ID更新单个定时任务信息。

**路径参数：**
- id: 任务UUID

**可更新字段：**
- name: 任务名称
- group: 任务分组
- invokeTarget: 调用目标
- cronExpression: Cron表达式
- misfirePolicy: 错过执行策略
- concurrent: 是否允许并发
- status: 状态，"0"=正常，"1"=暂停
- remark: 备注

**使用场景：**
1. 修改任务执行时间（cronExpression）
2. 暂停/恢复任务（status）
3. 调整任务配置

**示例：**
\`\`\`json
// PUT /api/system/job/550e8400-e29b-41d4-a716-446655440000
{
  "data": {
    "cronExpression": "0 0 3 * * ?",
    "status": "0"
  }
}
\`\`\``,
    tags: ['system', 'job'],
    method: 'PUT',
    path: '/api/system/job/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: jobZodSchemas.update }),
    outputSchema: jobZodSchemas.select,
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
