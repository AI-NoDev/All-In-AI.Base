/**
 * 字典模块工具函数
 */

import { dict } from '@qiyu-allinai/db/entities/system';

/** 字典类型定义 */
export type DictSelect = typeof dict.$inferSelect;
export type DictInsert = typeof dict.$inferInsert;
