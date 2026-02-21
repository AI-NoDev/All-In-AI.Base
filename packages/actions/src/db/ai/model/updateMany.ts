/**
 * 批量更新AI模型
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { model } from '@qiyu-allinai/db/entities/ai';
import { modelZodSchemas } from './schemas';
import type { ModelSelect, ModelInsert } from './utils';

export const modelUpdateMany = defineAction({
  meta: {
    name: 'ai.model.updateMany',
    displayName: '批量更新AI模型',
    description: `根据ID列表批量更新多个AI模型的配置。

**请求体：**
- ids: 要更新的模型ID数组
- data: 更新数据对象，包含要修改的字段

**使用场景：**
- 批量启用/禁用模型
- 批量修改配置参数

**示例：**
\`\`\`json
{
  "ids": ["model-id-1", "model-id-2"],
  "data": { "status": "1" }
}
\`\`\`

**返回：** 更新成功的模型对象数组`,
    tags: ['ai', 'model'],
    method: 'PUT',
    path: '/api/ai/model/batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: modelZodSchemas.update }),
    outputSchema: z.array(modelZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: ModelSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(model)
        .set(input.data as Partial<ModelInsert>)
        .where(eq(model.id, id))
        .returning();
      if (result) results.push(result as ModelSelect);
    }
    return results;
  },
});
