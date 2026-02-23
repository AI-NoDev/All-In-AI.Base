/**
 * 获取字典Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { dictSchemas } from '@qiyu-allinai/db/entities/system';

export const dictGetSchema = defineAction({
  meta: {
    name: 'system.dict.getSchema',
    ignoreTools: true,
    displayName: '获取字典Schema',
    description: `获取字典表的JSON Schema定义。

**返回：** JSON Schema 对象

**使用场景：**
- 前端动态生成表单
- API文档生成`,
    tags: ['system', 'dict'],
    method: 'GET',
    path: '/api/system/dict/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(dictSchemas.select) as Record<string, unknown>;
  },
});
