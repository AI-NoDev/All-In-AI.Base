/**
 * 删除定时任务
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job } from '@qiyu-allinai/db/entities/system';

export const jobDeleteByPk = defineAction({
  meta: {
    name: 'system.job.deleteByPk',
    displayName: '删除定时任务',
    description: `根据ID物理删除定时任务（永久删除，不可恢复）。

**参数说明：**
- id: 任务UUID

**删除行为：**
- 物理删除：数据从数据库中永久移除
- 不可恢复：删除后无法找回
- 任务将停止执行

**返回值：**
- true: 删除成功
- false: 任务不存在

**注意事项：**
- 删除前建议先暂停任务
- 确认任务不再需要后再删除
- 如需保留配置，建议暂停而非删除

**示例：**
DELETE /api/system/job/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'job'],
    method: 'DELETE',
    path: '/api/system/job/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(job).where(eq(job.id, input.id)).returning();
    return !!result;
  },
});
