/**
 * 通知公告模块工具类型
 */

import { notice } from '@qiyu-allinai/db/entities/system';

/** 通知查询返回类型 */
export type NoticeSelect = typeof notice.$inferSelect;

/** 通知插入类型 */
export type NoticeInsert = typeof notice.$inferInsert;
