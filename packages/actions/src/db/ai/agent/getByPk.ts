/**
 * 根据ID查询智能体
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agent, agentZodSchemas } from '@qiyu-allinai/db/entities/ai';
import type { AgentSelect } from './utils';

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
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: agentZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(agent).where(eq(agent.id, input.id)).limit(1);
    return (result as AgentSelect) ?? null;
  },
});
