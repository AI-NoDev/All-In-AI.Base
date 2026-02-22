/**
 * 批量更新定时任务
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job } from '@qiyu-allinai/db/entities/system';
import { jobZodSchemas } from './schemas';
import type { JobSelect, JobInsert } from './utils';

export const jobUpdateMany = defineAction({
  meta: {
    name: 'system.job.updateMany',
    ignoreTools: true,
    displayName: '批量更新定时任务',
    description: `根据ID列表批量更新定时任务，所有指定的任务将应用相同的更新数据。

**参数说明：**
- ids: 要更新的任务ID数组
- data: 更新的字段数据

**使用场景：**
1. 批量暂停任务：设置 status = "1"
2. 批量恢复任务：设置 status = "0"
3. 批量修改任务分组

**示例：**
\`\`\`json
{
  "ids": ["id1", "id2", "id3"],
  "data": {
    "status": "1",
    "remark": "维护期间暂停"
  }
}
\`\`\``,
    tags: ['system', 'job'],
    method: 'PUT',
    path: '/api/system/job/batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: jobZodSchemas.update }),
    outputSchema: z.array(jobZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: JobSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(job)
        .set(input.data as Partial<JobInsert>)
        .where(eq(job.id, id))
        .returning();
      if (result) results.push(result as JobSelect);
    }
    return results;
  },
});
