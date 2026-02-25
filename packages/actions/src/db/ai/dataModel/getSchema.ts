/**
 * 获取数据模型Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { dataModelSchemas } from './schemas';

export const dataModelGetSchema = defineAction({
  meta: {
    name: 'ai.dataModel.getSchema',
    ignoreTools: true,
    displayName: '获取数据模型Schema',
    description: `获取数据模型表的JSON Schema定义，用于动态表单生成或数据验证。

**返回：** JSON Schema 对象`,
    tags: ['ai', 'dataModel'],
    method: 'GET',
    path: '/api/ai/data-model/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(dataModelSchemas.select) as Record<string, unknown>;
  },
});
