/**
 * 工具组模块工具类型
 */

import { toolGroup } from '@qiyu-allinai/db/entities/ai';

/** 工具组查询返回类型 */
export type ToolGroupSelect = typeof toolGroup.$inferSelect;

/** 工具组插入类型 */
export type ToolGroupInsert = typeof toolGroup.$inferInsert;
