/**
 * 获取字典组Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { dictGroupSchemas } from '@qiyu-allinai/db/entities/system';

export const dictGroupGetSchema = defineAction({
  meta: {
    name: 'system.dictGroup.getSchema',
    ignoreTools: true,
    displayName: '获取字典组Schema',
    description: `获取字典组表的JSON Schema定义。

**返回：** JSON Schema 对象`,
    tags: ['system', 'dictGroup'],
    method: 'GET',
    path: '/api/system/dict-group/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(dictGroupSchemas.select) as Record<string, unknown>;
  },
});
