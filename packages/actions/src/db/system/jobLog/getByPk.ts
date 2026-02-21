/**
 * 根据ID查询任务日志
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { jobLog } from '@qiyu-allinai/db/entities/system';
import { jobLogZodSchemas } from './schemas';
import type { JobLogSelect } from './utils';

export const jobLogGetByPk = defineAction({
  meta: {
    name: 'system.jobLog.getByPk',
    displayName: '根据ID查询任务日志',
    description: `根据主键ID查询单个任务执行日志详情。

**参数说明：**
- id: 任务日志的UUID主键

**返回值：**
- 成功：返回日志完整信息（jobName, jobGroup, invokeTarget, jobMessage, status, exceptionInfo, startTime, stopTime等）
- 未找到：返回 null

**使用场景：**
1. 查看任务执行详情
2. 分析任务执行失败原因（查看 exceptionInfo）
3. 查看任务执行耗时

**示例：**
GET /api/system/job-log/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'jobLog'],
    method: 'GET',
    path: '/api/system/job-log/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: jobLogZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(jobLog).where(eq(jobLog.id, input.id)).limit(1);
    return (result as JobLogSelect) ?? null;
  },
});
