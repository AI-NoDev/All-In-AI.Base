/**
 * 批量创建任务日志
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { jobLog } from '@qiyu-allinai/db/entities/system';
import { jobLogZodSchemas } from './schemas';
import type { JobLogSelect, JobLogInsert } from './utils';

export const jobLogCreateMany = defineAction({
  meta: {
    name: 'system.jobLog.createMany',
    displayName: '批量创建任务日志',
    description: `批量创建多个任务执行日志记录。

**参数说明：**
- data: 日志数组，每个元素包含 jobName、jobGroup、invokeTarget 等字段

**使用场景：**
1. 批量导入历史执行记录
2. 批量任务执行后统一记录

**示例：**
\`\`\`json
{
  "data": [
    { "jobName": "任务A", "jobGroup": "DEFAULT", "invokeTarget": "taskA.run", "status": "0" },
    { "jobName": "任务B", "jobGroup": "DEFAULT", "invokeTarget": "taskB.run", "status": "0" }
  ]
}
\`\`\``,
    tags: ['system', 'jobLog'],
    method: 'POST',
    path: '/api/system/job-log/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(jobLogZodSchemas.insert) }),
    outputSchema: z.array(jobLogZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(jobLog).values(input.data as JobLogInsert[]).returning();
    return results as JobLogSelect[];
  },
});
