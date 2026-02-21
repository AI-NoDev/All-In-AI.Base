/**
 * 获取字典组Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { dictGroupZodSchemas } from './schemas';

export const dictGroupGetSchema = defineAction({
  meta: {
    name: 'system.dictGroup.getSchema',
    ignoreTools: true,
    displayName: '获取字典组Schema',
    description: `获取字典组表的JSON Schema定义。

**返回内容：**
- 字段名称和类型
- 必填/可选标识
- 字段约束

**使用场景：**
1. 前端动态生成字典组编辑表单
2. 数据导入时的格式验证
3. API文档生成`,
    tags: ['system', 'dictGroup'],
    method: 'GET',
    path: '/api/system/dict-group/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(dictGroupZodSchemas.select) as Record<string, unknown>;
  },
});
