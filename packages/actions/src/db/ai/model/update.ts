/**
 * 更新AI模型
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { model, modelSchemas } from '@qiyu-allinai/db/entities/ai';
import type { ModelSelect, ModelInsert } from '@qiyu-allinai/db/entities/ai/model';

export const modelUpdate = defineAction({
  meta: {
    name: 'ai.model.update',
    displayName: '更新AI模型',
    description: `根据ID更新单个AI模型的配置信息。

**路径参数：**
- id: 模型的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- name: 模型显示名称
- modelId: 模型标识
- status: 状态，"0"=正常，"1"=禁用
- supportTools: 是否支持工具调用
- supportThinking: 是否支持思考模式
- maxTokens: 最大token数
- temperature: 温度参数
- remark: 备注

**示例：**
\`\`\`json
PUT /api/ai/model/xxx-uuid
{
  "data": {
    "status": "1",
    "maxTokens": 64000
  }
}
\`\`\``,
    tags: ['ai', 'model'],
    method: 'PUT',
    path: '/api/ai/model/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: modelSchemas.update }),
    outputSchema: modelSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(model)
      .set(input.data as Partial<ModelInsert>)
      .where(eq(model.id, input.id))
      .returning();
    return result as ModelSelect;
  },
});
