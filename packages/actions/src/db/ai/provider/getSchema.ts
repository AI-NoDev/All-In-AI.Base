/**
 * 获取AI提供商Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { providerSchemas } from './schemas';

export const providerGetSchema = defineAction({
  meta: {
    name: 'ai.provider.getSchema',
    ignoreTools: true,
    displayName: '获取AI提供商Schema',
    description: `获取AI提供商表的JSON Schema定义，用于动态表单生成或数据验证。

**返回：** JSON Schema 对象

**使用场景：**
- 前端动态生成表单
- API文档生成`,
    tags: ['ai', 'provider'],
    method: 'GET',
    path: '/api/ai/provider/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(providerSchemas.select) as Record<string, unknown>;
  },
});
