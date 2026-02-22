/**
 * 批量更新任务日志
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog } from '@qiyu-allinai/db/entities/system';
import { jobLogZodSchemas } from './schemas';
import type { JobLogSelect, JobLogInsert } from './utils';

export const jobLogUpdateMany = defineAction({
  meta: {
    name: 'system.jobLog.updateMany',
    ignoreTools: true,
    displayName: '批量更新任务日志',
    description: `根据ID列表批量更新任务执行日志。

**参数说明：**
- ids: 要更新的日志ID数组
- data: 更新的字段数据

**使用场景：**
1. 批量标记日志状态
2. 批量添加备注

**示例：**
\`\`\`json
{
  "ids": ["id1", "id2", "id3"],
  "data": {
    "status": "1"
  }
}
\`\`\``,
    tags: ['system', 'jobLog'],
    method: 'PUT',
    path: '/api/system/job-log/batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: jobLogZodSchemas.update }),
    outputSchema: z.array(jobLogZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: JobLogSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(jobLog)
        .set(input.data as Partial<JobLogInsert>)
        .where(eq(jobLog.id, id))
        .returning();
      if (result) results.push(result as JobLogSelect);
    }
    return results;
  },
});
