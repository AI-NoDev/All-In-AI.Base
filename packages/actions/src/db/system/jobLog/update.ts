/**
 * 更新任务日志
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog } from '@qiyu-allinai/db/entities/system';
import { jobLogZodSchemas } from './schemas';
import type { JobLogSelect, JobLogInsert } from './utils';

export const jobLogUpdate = defineAction({
  meta: {
    name: 'system.jobLog.update',
    displayName: '更新任务日志',
    description: `根据ID更新单个任务执行日志信息。

**路径参数：**
- id: 日志UUID

**可更新字段：**
- jobMessage: 执行消息
- status: 执行状态
- exceptionInfo: 异常信息
- stopTime: 结束时间

**使用场景：**
1. 任务执行完成后更新状态和结束时间
2. 记录任务执行异常信息

**示例：**
\`\`\`json
// PUT /api/system/job-log/550e8400-e29b-41d4-a716-446655440000
{
  "data": {
    "status": "1",
    "exceptionInfo": "连接超时",
    "stopTime": "2024-01-01T02:01:00Z"
  }
}
\`\`\``,
    tags: ['system', 'jobLog'],
    method: 'PUT',
    path: '/api/system/job-log/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: jobLogZodSchemas.update }),
    outputSchema: jobLogZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(jobLog)
      .set(input.data as Partial<JobLogInsert>)
      .where(eq(jobLog.id, input.id))
      .returning();
    return result as JobLogSelect;
  },
});
