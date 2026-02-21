/**
 * 获取智能体 Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { agentZodSchemas } from '@qiyu-allinai/db/entities/ai';

export const agentGetSchema = defineAction({
  meta: {
    name: 'ai.agent.getSchema',
    ignoreTools: true,
    displayName: '获取AI智能体Schema',
    description: '获取AI智能体表的JSON Schema',
    tags: ['ai', 'agent'],
    method: 'GET',
    path: '/api/ai/agent/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(agentZodSchemas.select) as Record<string, unknown>;
  },
});
