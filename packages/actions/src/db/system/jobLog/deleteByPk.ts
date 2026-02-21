/**
 * 删除任务日志
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog } from '@qiyu-allinai/db/entities/system';

export const jobLogDeleteByPk = defineAction({
  meta: {
    name: 'system.jobLog.deleteByPk',
    displayName: '删除任务日志',
    description: `根据ID物理删除任务执行日志（永久删除，不可恢复）。

**参数说明：**
- id: 日志UUID

**删除行为：**
- 物理删除：数据从数据库中永久移除
- 不可恢复：删除后无法找回

**返回值：**
- true: 删除成功
- false: 日志不存在

**注意事项：**
- 任务日志通常需要保留用于问题排查
- 建议设置定期清理策略而非手动删除

**示例：**
DELETE /api/system/job-log/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'jobLog'],
    method: 'DELETE',
    path: '/api/system/job-log/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(jobLog).where(eq(jobLog.id, input.id)).returning();
    return !!result;
  },
});
