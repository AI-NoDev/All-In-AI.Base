/**
 * 获取字典Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { dictZodSchemas } from './schemas';

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
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(dictZodSchemas.select) as Record<string, unknown>;
  },
});
