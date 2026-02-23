/**
 * 获取工具组Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { toolGroupSchemas } from './schemas';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(toolGroupSchemas.select) as Record<string, unknown>;
  },
});
