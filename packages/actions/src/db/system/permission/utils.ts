/**
 * 权限模块工具函数和类型定义
 */

import { permission } from '@qiyu-allinai/db/entities/system';

/** 权限查询结果类型 */
export type PermissionSelect = typeof permission.$inferSelect;

/** 权限插入数据类型 */
export type PermissionInsert = typeof permission.$inferInsert;
