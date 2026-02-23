/**
 * 根据ID查询操作日志
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { operationLog, operationLogSchemas } from '@qiyu-allinai/db/entities/system';
import type { OperationLogSelect } from '@qiyu-allinai/db/entities/system/operationLog';

export const operationLogGetByPk = defineAction({
  meta: {
    name: 'system.operationLog.getByPk',
    displayName: '根据ID查询操作日志',
    description: '根据主键ID查询单个操作日志详情',
    tags: ['system', 'operationLog'],
    method: 'GET',
    path: '/api/system/operation-log/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([operationLogSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(operationLog).where(eq(operationLog.id, input.id)).limit(1);
    return (result as OperationLogSelect) ?? null;
  },
});
