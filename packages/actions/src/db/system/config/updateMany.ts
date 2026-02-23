/**
 * 批量更新系统配置
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config, configSchemas } from '@qiyu-allinai/db/entities/system';
import type { ConfigSelect, ConfigInsert } from './utils';

export const configUpdateMany = defineAction({
  meta: {
    name: 'system.config.updateMany',
    ignoreTools: true,
    displayName: '批量更新系统配置',
    description: '根据ID列表批量更新系统配置。',
    tags: ['system', 'config'],
    method: 'PUT',
    path: '/api/system/config/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: configSchemas.update }),
    outputSchema: t.Array(configSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: ConfigSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(config)
        .set(input.data as Partial<ConfigInsert>)
        .where(eq(config.id, id))
        .returning();
      if (result) results.push(result as ConfigSelect);
    }
    return results;
  },
});
