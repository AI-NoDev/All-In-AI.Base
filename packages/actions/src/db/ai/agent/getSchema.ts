/**
 * 获取智能体 Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { agentSchemas } from './schemas';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(agentSchemas.select) as Record<string, unknown>;
  },
});
