/**
 * AI提供商模块工具函数
 */

import { provider } from '@qiyu-allinai/db/entities/ai';

/** 提供商类型定义 */
export type ProviderSelect = typeof provider.$inferSelect;
export type ProviderInsert = typeof provider.$inferInsert;
