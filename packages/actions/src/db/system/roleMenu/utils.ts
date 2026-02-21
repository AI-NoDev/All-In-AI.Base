/**
 * 角色菜单关联模块工具函数和类型定义
 */

import { roleMenu } from '@qiyu-allinai/db/entities/system';

/** 角色菜单关联查询结果类型 */
export type RoleMenuSelect = typeof roleMenu.$inferSelect;

/** 角色菜单关联插入数据类型 */
export type RoleMenuInsert = typeof roleMenu.$inferInsert;
