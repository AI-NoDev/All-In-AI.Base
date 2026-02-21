/**
 * 批量创建智能体
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { agent, agentZodSchemas } from '@qiyu-allinai/db/entities/ai';
import type { AgentSelect, AgentInsert } from './utils';

export const agentCreateMany = defineAction({
  meta: {
    name: 'ai.agent.createMany',
    displayName: '批量创建AI智能体',
    description: '批量创建多个AI智能体',
    tags: ['ai', 'agent'],
    method: 'POST',
    path: '/api/ai/agent/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(agentZodSchemas.insert) }),
    outputSchema: z.array(agentZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.AGENT);
    
    const results = await db.insert(agent).values(input.data as AgentInsert[]).returning();
    return results as AgentSelect[];
  },
});
