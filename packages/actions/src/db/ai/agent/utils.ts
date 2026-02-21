/**
 * 智能体模块工具函数
 */

import { eq, and, isNull } from 'drizzle-orm';
import type { DrizzleDB } from '../../../core/types';
import { agent } from '@qiyu-allinai/db/entities/ai';
import { user } from '@qiyu-allinai/db/entities/system';

/** 智能体类型定义 */
export type AgentSelect = typeof agent.$inferSelect;
export type AgentInsert = typeof agent.$inferInsert;

/**
 * 通过创建者ID获取部门ID
 */
export async function getDeptIdByCreator(db: DrizzleDB, creatorId: string): Promise<string | null> {
  const [creator] = await db.select({ deptId: user.deptId })
    .from(user)
    .where(and(eq(user.id, creatorId), isNull(user.deletedAt)))
    .limit(1);
  return creator?.deptId || null;
}

/**
 * 通过智能体ID获取创建者的部门ID
 */
export async function getDeptIdByAgentId(db: DrizzleDB, agentId: string): Promise<string | null> {
  const [target] = await db.select({ createdById: agent.createdById })
    .from(agent)
    .where(eq(agent.id, agentId))
    .limit(1);
  
  if (!target?.createdById) return null;
  return getDeptIdByCreator(db, target.createdById);
}
