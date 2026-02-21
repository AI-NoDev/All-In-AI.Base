/**
 * 根据ID查询工具组
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toolGroup } from '@qiyu-allinai/db/entities/ai';
import { toolGroupZodSchemas } from './schemas';
import type { ToolGroupSelect } from './utils';

export const toolGroupGetByPk = defineAction({
  meta: {
    name: 'ai.toolGroup.getByPk',
    displayName: '根据ID查询工具组',
    description: `根据主键ID查询单个工具组详情。

**参数说明：**
- id: 工具组的UUID主键

**返回值：**
- 成功：返回工具组完整信息
- 未找到：返回 null

**示例：**
GET /api/ai/tool-group/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['ai', 'toolGroup'],
    method: 'GET',
    path: '/api/ai/tool-group/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: toolGroupZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(toolGroup).where(eq(toolGroup.id, input.id)).limit(1);
    return (result as ToolGroupSelect) ?? null;
  },
});
