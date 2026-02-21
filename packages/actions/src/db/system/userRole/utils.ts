/**
 * 用户角色关联模块工具函数和类型定义
 */

import { userRole } from '@qiyu-allinai/db/entities/system';

/** 用户角色关联查询结果类型 */
export type UserRoleSelect = typeof userRole.$inferSelect;

/** 用户角色关联插入数据类型 */
export type UserRoleInsert = typeof userRole.$inferInsert;
