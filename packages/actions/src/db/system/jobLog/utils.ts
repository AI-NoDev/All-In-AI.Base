/**
 * 任务日志模块工具类型
 */

import { jobLog } from '@qiyu-allinai/db/entities/system';

/** 任务日志查询返回类型 */
export type JobLogSelect = typeof jobLog.$inferSelect;

/** 任务日志插入类型 */
export type JobLogInsert = typeof jobLog.$inferInsert;
