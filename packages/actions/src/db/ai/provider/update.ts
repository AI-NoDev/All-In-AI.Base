/**
 * 更新AI提供商
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { provider, providerSchemas } from '@qiyu-allinai/db/entities/ai';
import type { ProviderSelect, ProviderInsert } from '@qiyu-allinai/db/entities/ai/provider';

export const providerUpdate = defineAction({
  meta: {
    name: 'ai.provider.update',
    displayName: '更新AI提供商',
    description: `根据ID更新单个AI提供商的配置信息。

**路径参数：**
- id: 提供商的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- name: 提供商名称
- baseUrl: API基础URL
- token: API密钥（更新密钥时使用）
- status: 状态，"0"=正常，"1"=禁用
- remark: 备注

**示例：**
\`\`\`json
PUT /api/ai/provider/xxx-uuid
{
  "data": {
    "token": "sk-new-token",
    "status": "0"
  }
}
\`\`\``,
    tags: ['ai', 'provider'],
    method: 'PUT',
    path: '/api/ai/provider/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: providerSchemas.update }),
    outputSchema: providerSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(provider)
      .set(input.data as Partial<ProviderInsert>)
      .where(eq(provider.id, input.id))
      .returning();
    return result as ProviderSelect;
  },
});
