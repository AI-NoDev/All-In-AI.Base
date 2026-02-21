/**
 * 创建AI提供商
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { provider } from '@qiyu-allinai/db/entities/ai';
import { providerZodSchemas } from './schemas';
import type { ProviderSelect, ProviderInsert } from './utils';

export const providerCreate = defineAction({
  meta: {
    name: 'ai.provider.create',
    displayName: '创建AI提供商',
    description: `创建单个AI提供商配置。

**必填字段：**
- name: 提供商名称（如 OpenAI, Anthropic, 火山引擎）
- baseUrl: API基础URL
- token: API密钥/Token

**可选字段：**
- status: 状态，"0"=正常（默认），"1"=禁用
- remark: 备注

**示例：**
\`\`\`json
{
  "data": {
    "name": "OpenAI",
    "baseUrl": "https://api.openai.com/v1",
    "token": "sk-xxx",
    "status": "0"
  }
}
\`\`\``,
    tags: ['ai', 'provider'],
    method: 'POST',
    path: '/api/ai/provider',
  },
  schemas: {
    bodySchema: z.object({ data: providerZodSchemas.insert }),
    outputSchema: providerZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(provider).values(input.data as ProviderInsert).returning();
    return result as ProviderSelect;
  },
});
