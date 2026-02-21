/**
 * 角色部门关联模块工具函数和类型定义
 */

import { roleDepartment } from '@qiyu-allinai/db/entities/system';

/** 角色部门关联查询结果类型 */
export type RoleDepartmentSelect = typeof roleDepartment.$inferSelect;

/** 角色部门关联插入数据类型 */
export type RoleDepartmentInsert = typeof roleDepartment.$inferInsert;
