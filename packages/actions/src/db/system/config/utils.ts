/**
 * 系统配置模块工具类型
 */

import { config } from '@qiyu-allinai/db/entities/system';

/** 配置查询返回类型 */
export type ConfigSelect = typeof config.$inferSelect;

/** 配置插入类型 */
export type ConfigInsert = typeof config.$inferInsert;
