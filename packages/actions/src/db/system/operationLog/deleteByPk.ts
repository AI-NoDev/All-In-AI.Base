/**
 * 删除操作日志
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { operationLog } from '@qiyu-allinai/db/entities/system';

export const operationLogDeleteByPk = defineAction({
  meta: {
    name: 'system.operationLog.deleteByPk',
    displayName: '删除操作日志',
    description: '根据ID物理删除操作日志（永久删除，不可恢复）',
    tags: ['system', 'operationLog'],
    method: 'DELETE',
    path: '/api/system/operation-log/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(operationLog).where(eq(operationLog.id, input.id)).returning();
    return !!result;
  },
});
