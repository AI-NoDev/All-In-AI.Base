/**
 * 根据ID查询AI提供商
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { provider } from '@qiyu-allinai/db/entities/ai';
import { providerZodSchemas } from './schemas';
import type { ProviderSelect } from './utils';

export const providerGetByPk = defineAction({
  meta: {
    name: 'ai.provider.getByPk',
    displayName: '根据ID查询AI提供商',
    description: `根据主键ID查询单个AI提供商的详细信息。

**路径参数：**
- id: 提供商的UUID

**返回：**
- 找到时返回完整的提供商对象（包含 baseUrl, token 等敏感信息）
- 未找到时返回 null

**示例：**
GET /api/ai/provider/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'provider'],
    method: 'GET',
    path: '/api/ai/provider/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: providerZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(provider).where(eq(provider.id, input.id)).limit(1);
    return (result as ProviderSelect) ?? null;
  },
});
