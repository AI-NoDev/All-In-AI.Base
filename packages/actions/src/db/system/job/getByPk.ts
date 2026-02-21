/**
 * 根据ID查询定时任务
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { job } from '@qiyu-allinai/db/entities/system';
import { jobZodSchemas } from './schemas';
import type { JobSelect } from './utils';

export const jobGetByPk = defineAction({
  meta: {
    name: 'system.job.getByPk',
    displayName: '根据ID查询定时任务',
    description: `根据主键ID查询单个定时任务详情。

**参数说明：**
- id: 定时任务的UUID主键

**返回值：**
- 成功：返回任务完整信息（name, group, invokeTarget, cronExpression, misfirePolicy, concurrent, status等）
- 未找到：返回 null

**使用场景：**
1. 查看任务详情
2. 编辑任务前获取当前配置
3. 验证任务是否存在

**示例：**
GET /api/system/job/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'job'],
    method: 'GET',
    path: '/api/system/job/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: jobZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(job).where(eq(job.id, input.id)).limit(1);
    return (result as JobSelect) ?? null;
  },
});
