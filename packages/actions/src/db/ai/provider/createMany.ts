/**
 * 批量创建AI提供商
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { provider } from '@qiyu-allinai/db/entities/ai';
import { providerZodSchemas } from './schemas';
import type { ProviderSelect, ProviderInsert } from './utils';

export const providerCreateMany = defineAction({
  meta: {
    name: 'ai.provider.createMany',
    displayName: '批量创建AI提供商',
    description: `批量创建多个AI提供商配置，适用于初始化场景。

**请求体：**
- data: 提供商对象数组

**示例：**
\`\`\`json
{
  "data": [
    { "name": "OpenAI", "baseUrl": "https://api.openai.com/v1", "token": "sk-xxx" },
    { "name": "Anthropic", "baseUrl": "https://api.anthropic.com", "token": "sk-ant-xxx" }
  ]
}
\`\`\`

**返回：** 创建成功的提供商对象数组`,
    tags: ['ai', 'provider'],
    method: 'POST',
    path: '/api/ai/provider/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(providerZodSchemas.insert) }),
    outputSchema: z.array(providerZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(provider).values(input.data as ProviderInsert[]).returning();
    return results as ProviderSelect[];
  },
});
