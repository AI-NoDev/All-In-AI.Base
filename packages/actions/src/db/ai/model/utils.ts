/**
 * AI模型模块工具函数
 */

import { model } from '@qiyu-allinai/db/entities/ai';

/** 模型类型定义 */
export type ModelSelect = typeof model.$inferSelect;
export type ModelInsert = typeof model.$inferInsert;
