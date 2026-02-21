/**
 * 操作日志模块工具类型
 */

import { operationLog } from '@qiyu-allinai/db/entities/system';

/** 操作日志查询返回类型 */
export type OperationLogSelect = typeof operationLog.$inferSelect;

/** 操作日志插入类型 */
export type OperationLogInsert = typeof operationLog.$inferInsert;
