/**
 * 批量更新智能体
 */

import { z } from 'zod';
import { eq, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { isSystemAdmin } from '../../../core/deptPermission';
import { agent, agentZodSchemas } from '@qiyu-allinai/db/entities/ai';
import type { AgentSelect, AgentInsert } from './utils';

export const agentUpdateMany = defineAction({
  meta: {
    name: 'ai.agent.updateMany',
    ignoreTools: true,
    displayName: '批量更新AI智能体',
    description: '批量更新多个智能体配置。传入ids数组指定要更新的智能体，data对象包含要更新的字段。只能更新自己创建的智能体，管理员可更新所有。示例：{"ids":["id1","id2"],"data":{"status":"1","temperature":0.8}}',
    tags: ['ai', 'agent'],
    method: 'PUT',
    path: '/api/ai/agent/batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: agentZodSchemas.update }),
    outputSchema: z.array(agentZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserType } = context;
    
    // 获取所有目标智能体
    const targets = await db.select({ id: agent.id, createdById: agent.createdById })
      .from(agent)
      .where(inArray(agent.id, input.ids));
    
    // 权限检查：只有创建者或系统管理员可以更新
    const isSysAdmin = isSystemAdmin(currentUserType);
    const allowedIds = targets
      .filter(t => t.createdById === currentUserId || isSysAdmin)
      .map(t => t.id);
    
    if (allowedIds.length === 0) {
      throw ActionError.forbidden('error.permission.noWriteAccess');
    }
    
    const results: AgentSelect[] = [];
    for (const id of allowedIds) {
      const [result] = await db.update(agent)
        .set(input.data as Partial<AgentInsert>)
        .where(eq(agent.id, id))
        .returning();
      if (result) results.push(result as AgentSelect);
    }
    return results;
  },
});
