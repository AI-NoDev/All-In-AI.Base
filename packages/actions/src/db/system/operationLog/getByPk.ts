/**
 * 根据ID查询操作日志
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { operationLog } from '@qiyu-allinai/db/entities/system';
import { operationLogZodSchemas } from './schemas';
import type { OperationLogSelect } from './utils';

export const operationLogGetByPk = defineAction({
  meta: {
    name: 'system.operationLog.getByPk',
    displayName: '根据ID查询操作日志',
    description: `根据主键ID查询单个操作日志详情。

**参数说明：**
- id: 操作日志的UUID主键

**返回值：**
- 成功：返回操作日志完整信息（title, method, url, param, result, status, errorMsg, time等）
- 未找到：返回 null

**使用场景：**
1. 查看操作详情（请求参数、返回结果）
2. 分析操作失败原因
3. 安全审计和问题排查

**示例：**
GET /api/system/operation-log/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'operationLog'],
    method: 'GET',
    path: '/api/system/operation-log/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: operationLogZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(operationLog).where(eq(operationLog.id, input.id)).limit(1);
    return (result as OperationLogSelect) ?? null;
  },
});
