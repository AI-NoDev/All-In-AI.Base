/**
 * 创建智能体
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { agent, agentZodSchemas } from '@qiyu-allinai/db/entities/ai';
import type { AgentSelect, AgentInsert } from './utils';

export const agentCreate = defineAction({
  meta: {
    name: 'ai.agent.create',
    displayName: '创建AI智能体',
    description: '创建单个AI智能体',
    tags: ['ai', 'agent'],
    method: 'POST',
    path: '/api/ai/agent',
  },
  schemas: {
    bodySchema: z.object({ data: agentZodSchemas.insert }),
    outputSchema: agentZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 智能体为个人资源，无需部门权限校验，直接创建
    const [result] = await db.insert(agent).values(input.data as AgentInsert).returning();
    return result as AgentSelect;
  },
});
