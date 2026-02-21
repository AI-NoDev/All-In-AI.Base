/**
 * 创建定时任务
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { job } from '@qiyu-allinai/db/entities/system';
import { jobZodSchemas } from './schemas';
import type { JobSelect, JobInsert } from './utils';

export const jobCreate = defineAction({
  meta: {
    name: 'system.job.create',
    displayName: '创建定时任务',
    description: `创建单个定时任务记录。

**必填字段：**
- name: 任务名称，如 "清理临时文件"
- group: 任务分组，如 "DEFAULT"、"SYSTEM"
- invokeTarget: 调用目标（类名.方法名）
- cronExpression: Cron表达式，如 "0 0 2 * * ?" 表示每天凌晨2点

**可选字段：**
- misfirePolicy: 错过执行策略（0=默认，1=立即执行，2=执行一次，3=放弃执行）
- concurrent: 是否允许并发执行，默认 false
- status: 状态，"0"=正常（默认），"1"=暂停
- remark: 备注说明

**Cron表达式示例：**
- "0 0 2 * * ?": 每天凌晨2点
- "0 0/30 * * * ?": 每30分钟
- "0 0 10,14,16 * * ?": 每天10点、14点、16点

**示例：**
\`\`\`json
{
  "data": {
    "name": "清理临时文件",
    "group": "SYSTEM",
    "invokeTarget": "cleanTask.execute",
    "cronExpression": "0 0 2 * * ?",
    "misfirePolicy": "1",
    "concurrent": false,
    "status": "0"
  }
}
\`\`\``,
    tags: ['system', 'job'],
    method: 'POST',
    path: '/api/system/job',
  },
  schemas: {
    bodySchema: z.object({ data: jobZodSchemas.insert }),
    outputSchema: jobZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(job).values(input.data as JobInsert).returning();
    return result as JobSelect;
  },
});
