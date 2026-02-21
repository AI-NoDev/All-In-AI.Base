/**
 * Agent会话模块工具类型
 */

import { agentSession } from '@qiyu-allinai/db/entities/ai';

/** Agent会话查询返回类型 */
export type AgentSessionSelect = typeof agentSession.$inferSelect;

/** Agent会话插入类型 */
export type AgentSessionInsert = typeof agentSession.$inferInsert;
