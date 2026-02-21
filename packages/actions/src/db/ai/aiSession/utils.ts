/**
 * AI会话模块工具函数
 */

import { aiSession } from '@qiyu-allinai/db/entities/ai';

/** AI会话类型定义 */
export type AISessionSelect = typeof aiSession.$inferSelect;
export type AISessionInsert = typeof aiSession.$inferInsert;
