/**
 * 根据ID查询系统配置
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config, configSchemas } from '@qiyu-allinai/db/entities/system';
import type { ConfigSelect } from './utils';

export const configGetByPk = defineAction({
  meta: {
    name: 'system.config.getByPk',
    displayName: '根据ID查询系统配置',
    description: '根据主键ID查询单个系统配置详情。',
    tags: ['system', 'config'],
    method: 'GET',
    path: '/api/system/config/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([configSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(config).where(eq(config.id, input.id)).limit(1);
    return (result as ConfigSelect) ?? null;
  },
});
