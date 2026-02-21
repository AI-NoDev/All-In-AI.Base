/**
 * 创建任务日志
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { jobLog } from '@qiyu-allinai/db/entities/system';
import { jobLogZodSchemas } from './schemas';
import type { JobLogSelect, JobLogInsert } from './utils';

export const jobLogCreate = defineAction({
  meta: {
    name: 'system.jobLog.create',
    displayName: '创建任务日志',
    description: `创建单个任务执行日志记录（通常由任务调度器自动调用）。

**必填字段：**
- jobName: 任务名称
- jobGroup: 任务分组
- invokeTarget: 调用目标

**可选字段：**
- jobMessage: 执行消息
- status: 执行状态，"0"=成功，"1"=失败
- exceptionInfo: 异常信息（失败时记录）
- startTime: 开始时间
- stopTime: 结束时间

**使用场景：**
1. 任务执行开始时创建日志
2. 任务执行完成后更新状态
3. 手动记录任务执行情况

**示例：**
\`\`\`json
{
  "data": {
    "jobName": "清理临时文件",
    "jobGroup": "SYSTEM",
    "invokeTarget": "cleanTask.execute",
    "status": "0",
    "jobMessage": "清理完成，删除100个文件",
    "startTime": "2024-01-01T02:00:00Z",
    "stopTime": "2024-01-01T02:00:30Z"
  }
}
\`\`\``,
    tags: ['system', 'jobLog'],
    method: 'POST',
    path: '/api/system/job-log',
  },
  schemas: {
    bodySchema: z.object({ data: jobLogZodSchemas.insert }),
    outputSchema: jobLogZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(jobLog).values(input.data as JobLogInsert).returning();
    return result as JobLogSelect;
  },
});
