/**
 * 批量创建系统配置
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { config, configSchemas } from '@qiyu-allinai/db/entities/system';
import type { ConfigSelect, ConfigInsert } from './utils';

export const configCreateMany = defineAction({
  meta: {
    name: 'system.config.createMany',
    ignoreTools: true,
    displayName: '批量创建系统配置',
    description: '批量创建多个系统配置记录。',
    tags: ['system', 'config'],
    method: 'POST',
    path: '/api/system/config/batch',
  },
  schemas: {
    bodySchema: t.Object({ data: t.Array(configSchemas.insert) }),
    outputSchema: t.Array(configSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(config).values(input.data as ConfigInsert[]).returning();
    return results as ConfigSelect[];
  },
});
