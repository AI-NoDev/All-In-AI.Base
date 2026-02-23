/**
 * 获取AI模型Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { modelSchemas } from './schemas';

export const modelGetSchema = defineAction({
  meta: {
    name: 'ai.model.getSchema',
    ignoreTools: true,
    displayName: '获取AI模型Schema',
    description: `获取AI模型表的JSON Schema定义，用于动态表单生成或数据验证。

**返回：** JSON Schema 对象，包含所有字段的类型定义

**使用场景：**
- 前端动态生成表单
- API文档生成
- 数据验证`,
    tags: ['ai', 'model'],
    method: 'GET',
    path: '/api/ai/model/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(modelSchemas.select) as Record<string, unknown>;
  },
});
