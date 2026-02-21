/**
 * 字典组模块工具类型
 */

import { dictGroup } from '@qiyu-allinai/db/entities/system';

/** 字典组查询返回类型 */
export type DictGroupSelect = typeof dictGroup.$inferSelect;

/** 字典组插入类型 */
export type DictGroupInsert = typeof dictGroup.$inferInsert;
