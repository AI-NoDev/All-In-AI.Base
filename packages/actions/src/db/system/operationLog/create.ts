/**
 * 创建操作日志
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { operationLog, operationLogSchemas } from '@qiyu-allinai/db/entities/system';
import type { OperationLogSelect, OperationLogInsert } from '@qiyu-allinai/db/entities/system/operationLog';

export const operationLogCreate = defineAction({
  meta: {
    name: 'system.operationLog.create',
    displayName: '创建操作日志',
    description: '创建单个操作日志记录（通常由系统自动调用）',
    tags: ['system', 'operationLog'],
    method: 'POST',
    path: '/api/system/operation-log',
  },
  schemas: {
    bodySchema: t.Object({ data: operationLogSchemas.insert }),
    outputSchema: operationLogSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(operationLog).values(input.data as OperationLogInsert).returning();
    return result as OperationLogSelect;
  },
});
