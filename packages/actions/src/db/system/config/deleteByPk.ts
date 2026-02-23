/**
 * 删除系统配置
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config } from '@qiyu-allinai/db/entities/system';

export const configDeleteByPk = defineAction({
  meta: {
    name: 'system.config.deleteByPk',
    displayName: '删除系统配置',
    description: '根据ID物理删除系统配置（永久删除，不可恢复）。',
    tags: ['system', 'config'],
    method: 'DELETE',
    path: '/api/system/config/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(config).where(eq(config.id, input.id)).returning();
    return !!result;
  },
});
