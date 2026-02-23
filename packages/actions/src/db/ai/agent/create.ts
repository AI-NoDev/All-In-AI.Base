/**
 * 创建智能体
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { agent } from '@qiyu-allinai/db/entities/ai';
import { agentSchemas, type AgentSelect, type AgentInsert } from './schemas';

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
    bodySchema: t.Object({ data: agentSchemas.insert }),
    outputSchema: agentSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 智能体为个人资源，无需部门权限校验，直接创建
    const [result] = await db.insert(agent).values(input.data as AgentInsert).returning();
    return result as AgentSelect;
  },
});
