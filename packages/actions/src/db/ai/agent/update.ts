/**
 * 更新智能体
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { isSystemAdmin } from '../../../core/deptPermission';
import { agent } from '@qiyu-allinai/db/entities/ai';
import { agentSchemas, type AgentSelect, type AgentInsert } from './schemas';

export const agentUpdate = defineAction({
  meta: {
    name: 'ai.agent.update',
    displayName: '更新AI智能体',
    description: '根据ID更新单个AI智能体',
    tags: ['ai', 'agent'],
    method: 'PUT',
    path: '/api/ai/agent/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: agentSchemas.update }),
    outputSchema: agentSchemas.select,
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserType } = context;
    
    // 检查智能体是否存在
    const [existing] = await db.select({ id: agent.id, createdById: agent.createdById })
      .from(agent)
      .where(eq(agent.id, input.id))
      .limit(1);
    
    if (!existing) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    // 权限检查：只有创建者或系统管理员可以更新
    if (existing.createdById !== currentUserId && !isSystemAdmin(currentUserType)) {
      throw ActionError.forbidden('error.permission.noWriteAccess');
    }
    
    const [result] = await db.update(agent)
      .set(input.data as Partial<AgentInsert>)
      .where(eq(agent.id, input.id))
      .returning();
    
    return result as AgentSelect;
  },
});
