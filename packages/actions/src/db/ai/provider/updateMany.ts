/**
 * 批量更新AI提供商
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { provider, providerSchemas } from '@qiyu-allinai/db/entities/ai';
import type { ProviderSelect, ProviderInsert } from '@qiyu-allinai/db/entities/ai/provider';

export const providerUpdateMany = defineAction({
  meta: {
    name: 'ai.provider.updateMany',
    ignoreTools: true,
    displayName: '批量更新AI提供商',
    description: `根据ID列表批量更新多个AI提供商的配置。

**请求体：**
- ids: 要更新的提供商ID数组
- data: 更新数据对象

**使用场景：**
- 批量启用/禁用提供商

**示例：**
\`\`\`json
{
  "ids": ["provider-id-1", "provider-id-2"],
  "data": { "status": "1" }
}
\`\`\`

**返回：** 更新成功的提供商对象数组`,
    tags: ['ai', 'provider'],
    method: 'PUT',
    path: '/api/ai/provider/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: providerSchemas.update }),
    outputSchema: t.Array(providerSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: ProviderSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(provider)
        .set(input.data as Partial<ProviderInsert>)
        .where(eq(provider.id, id))
        .returning();
      if (result) results.push(result as ProviderSelect);
    }
    return results;
  },
});
