/**
 * 通知已读记录模块工具类型
 */

import { noticeRead } from '@qiyu-allinai/db/entities/system';

/** 通知已读记录查询返回类型 */
export type NoticeReadSelect = typeof noticeRead.$inferSelect;

/** 通知已读记录插入类型 */
export type NoticeReadInsert = typeof noticeRead.$inferInsert;
