/**
 * Agent消息模块工具类型
 */

import { agentMessage } from '@qiyu-allinai/db/entities/ai';

/** Agent消息查询返回类型 */
export type AgentMessageSelect = typeof agentMessage.$inferSelect;

/** Agent消息插入类型 */
export type AgentMessageInsert = typeof agentMessage.$inferInsert;
