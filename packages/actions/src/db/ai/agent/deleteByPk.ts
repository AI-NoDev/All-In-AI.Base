/**
 * 删除智能体
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { isSystemAdmin } from '../../../core/deptPermission';
import { agent } from '@qiyu-allinai/db/entities/ai';

export const agentDeleteByPk = defineAction({
  meta: {
    name: 'ai.agent.deleteByPk',
    displayName: '删除AI智能体',
    description: '根据ID删除AI智能体',
    tags: ['ai', 'agent'],
    method: 'DELETE',
    path: '/api/ai/agent/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserType } = context;
    
    // 检查智能体是否存在
    const [existing] = await db.select({ id: agent.id, createdById: agent.createdById })
      .from(agent)
      .where(eq(agent.id, input.id))
      .limit(1);
    
    if (!existing) {
      return false;
    }
    
    // 权限检查：只有创建者或系统管理员可以删除
    if (existing.createdById !== currentUserId && !isSystemAdmin(currentUserType)) {
      throw ActionError.forbidden('error.permission.noManageAccess');
    }
    
    const [result] = await db.delete(agent).where(eq(agent.id, input.id)).returning();
    return !!result;
  },
});
