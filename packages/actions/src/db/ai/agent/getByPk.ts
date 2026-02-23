/**
 * 根据ID查询智能体
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agent } from '@qiyu-allinai/db/entities/ai';
import { agentSchemas, type AgentSelect } from './schemas';

export const agentGetByPk = defineAction({
  meta: {
    name: 'ai.agent.getByPk',
    displayName: '根据ID查询AI智能体',
    description: '根据主键ID查询单个AI智能体',
    tags: ['ai', 'agent'],
    method: 'GET',
    path: '/api/ai/agent/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([agentSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(agent).where(eq(agent.id, input.id)).limit(1);
    return (result as AgentSelect) ?? null;
  },
});
