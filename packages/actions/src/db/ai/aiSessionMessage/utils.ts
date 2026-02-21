/**
 * AI会话消息模块工具函数
 */

import { aiSessionMessage } from '@qiyu-allinai/db/entities/ai';

/** AI会话消息类型定义 */
export type AISessionMessageSelect = typeof aiSessionMessage.$inferSelect;
export type AISessionMessageInsert = typeof aiSessionMessage.$inferInsert;

/** Token使用量类型 */
export interface TokenUsage {
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
}
