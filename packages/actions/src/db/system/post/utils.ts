/**
 * 岗位模块工具类型
 */

import { post } from '@qiyu-allinai/db/entities/system';

/** 岗位查询返回类型 */
export type PostSelect = typeof post.$inferSelect;

/** 岗位插入类型 */
export type PostInsert = typeof post.$inferInsert;
