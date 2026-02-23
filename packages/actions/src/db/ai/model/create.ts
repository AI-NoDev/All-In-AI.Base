/**
 * 创建AI模型
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { model, modelSchemas } from '@qiyu-allinai/db/entities/ai';
import type { ModelSelect, ModelInsert } from '@qiyu-allinai/db/entities/ai/model';

export const modelCreate = defineAction({
  meta: {
    name: 'ai.model.create',
    displayName: '创建AI模型',
    description: `创建单个AI模型配置。

**必填字段：**
- name: 模型显示名称
- modelId: 模型标识（如 gpt-4, claude-3-opus）
- providerId: 所属提供商ID

**可选字段：**
- status: 状态，"0"=正常（默认），"1"=禁用
- supportTools: 是否支持工具调用，默认false
- supportThinking: 是否支持思考模式，默认false
- maxTokens: 最大token数
- temperature: 温度参数
- remark: 备注

**示例：**
\`\`\`json
{
  "data": {
    "name": "GPT-4 Turbo",
    "modelId": "gpt-4-turbo",
    "providerId": "provider-uuid",
    "supportTools": true,
    "maxTokens": 128000
  }
}
\`\`\``,
    tags: ['ai', 'model'],
    method: 'POST',
    path: '/api/ai/model',
  },
  schemas: {
    bodySchema: t.Object({ data: modelSchemas.insert }),
    outputSchema: modelSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(model).values(input.data as ModelInsert).returning();
    return result as ModelSelect;
  },
});
