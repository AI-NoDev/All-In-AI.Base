/**
 * 批量创建定时任务
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { job } from '@qiyu-allinai/db/entities/system';
import { jobZodSchemas } from './schemas';
import type { JobSelect, JobInsert } from './utils';

export const jobCreateMany = defineAction({
  meta: {
    name: 'system.job.createMany',
    displayName: '批量创建定时任务',
    description: `批量创建多个定时任务记录。

**参数说明：**
- data: 任务数组，每个元素包含 name、group、invokeTarget、cronExpression 等字段

**使用场景：**
1. 系统初始化时批量创建默认任务
2. 导入任务配置
3. 批量添加某类任务

**示例：**
\`\`\`json
{
  "data": [
    { "name": "清理日志", "group": "SYSTEM", "invokeTarget": "logTask.clean", "cronExpression": "0 0 3 * * ?" },
    { "name": "数据备份", "group": "SYSTEM", "invokeTarget": "backupTask.run", "cronExpression": "0 0 4 * * ?" }
  ]
}
\`\`\``,
    tags: ['system', 'job'],
    method: 'POST',
    path: '/api/system/job/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(jobZodSchemas.insert) }),
    outputSchema: z.array(jobZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(job).values(input.data as JobInsert[]).returning();
    return results as JobSelect[];
  },
});
