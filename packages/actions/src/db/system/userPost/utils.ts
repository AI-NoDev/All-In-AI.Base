/**
 * 用户岗位关联模块工具函数和类型定义
 */

import { userPost } from '@qiyu-allinai/db/entities/system';

/** 用户岗位关联查询结果类型 */
export type UserPostSelect = typeof userPost.$inferSelect;

/** 用户岗位关联插入数据类型 */
export type UserPostInsert = typeof userPost.$inferInsert;
