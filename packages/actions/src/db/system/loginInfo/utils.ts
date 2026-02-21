/**
 * 登录日志模块工具类型
 */

import { loginInfo } from '@qiyu-allinai/db/entities/system';

/** 登录日志查询返回类型 */
export type LoginInfoSelect = typeof loginInfo.$inferSelect;

/** 登录日志插入类型 */
export type LoginInfoInsert = typeof loginInfo.$inferInsert;
