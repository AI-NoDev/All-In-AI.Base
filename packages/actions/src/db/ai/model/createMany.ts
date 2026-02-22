/**
 * 批量创建AI模型
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { model } from '@qiyu-allinai/db/entities/ai';
import { modelZodSchemas } from './schemas';
import type { ModelSelect, ModelInsert } from './utils';

export const modelCreateMany = defineAction({
  meta: {
    name: 'ai.model.createMany',
    ignoreTools: true,
    displayName: '批量创建AI模型',
    description: `批量创建多个AI模型配置，适用于初始化或导入场景。

**请求体：**
- data: 模型对象数组，每个对象包含 name, modelId, providerId 等字段

**示例：**
\`\`\`json
{
  "data": [
    { "name": "GPT-4", "modelId": "gpt-4", "providerId": "xxx", "supportTools": true },
    { "name": "GPT-3.5", "modelId": "gpt-3.5-turbo", "providerId": "xxx", "supportTools": true }
  ]
}
\`\`\`

**返回：** 创建成功的模型对象数组`,
    tags: ['ai', 'model'],
    method: 'POST',
    path: '/api/ai/model/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(modelZodSchemas.insert) }),
    outputSchema: z.array(modelZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(model).values(input.data as ModelInsert[]).returning();
    return results as ModelSelect[];
  },
});
