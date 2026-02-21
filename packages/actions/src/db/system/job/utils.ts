/**
 * 定时任务模块工具类型
 */

import { job } from '@qiyu-allinai/db/entities/system';

/** 定时任务查询返回类型 */
export type JobSelect = typeof job.$inferSelect;

/** 定时任务插入类型 */
export type JobInsert = typeof job.$inferInsert;
