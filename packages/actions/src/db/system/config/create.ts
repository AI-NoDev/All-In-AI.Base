/**
 * 创建系统配置
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { config, configSchemas } from '@qiyu-allinai/db/entities/system';
import type { ConfigSelect, ConfigInsert } from './utils';

export const configCreate = defineAction({
  meta: {
    name: 'system.config.create',
    displayName: '创建系统配置',
    description: '创建单个系统配置记录。',
    tags: ['system', 'config'],
    method: 'POST',
    path: '/api/system/config',
  },
  schemas: {
    bodySchema: t.Object({ data: configSchemas.insert }),
    outputSchema: configSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(config).values(input.data as ConfigInsert).returning();
    return result as ConfigSelect;
  },
});
