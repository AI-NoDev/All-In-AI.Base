/**
 * 获取工具组Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { toolGroupZodSchemas } from './schemas';

export const toolGroupGetSchema = defineAction({
  meta: {
    name: 'ai.toolGroup.getSchema',
    ignoreTools: true,
    displayName: '获取工具组Schema',
    description: `获取工具组表的JSON Schema定义。`,
    tags: ['ai', 'toolGroup'],
    method: 'GET',
    path: '/api/ai/tool-group/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(toolGroupZodSchemas.select) as Record<string, unknown>;
  },
});
