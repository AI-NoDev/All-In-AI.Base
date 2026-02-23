/**
 * 更新系统配置
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config, configSchemas } from '@qiyu-allinai/db/entities/system';
import type { ConfigSelect, ConfigInsert } from './utils';

export const configUpdate = defineAction({
  meta: {
    name: 'system.config.update',
    displayName: '更新系统配置',
    description: '根据ID更新单个系统配置信息。',
    tags: ['system', 'config'],
    method: 'PUT',
    path: '/api/system/config/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: configSchemas.update }),
    outputSchema: configSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(config)
      .set(input.data as Partial<ConfigInsert>)
      .where(eq(config.id, input.id))
      .returning();
    return result as ConfigSelect;
  },
});
