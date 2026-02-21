/**
 * IM 消息模块
 */

// 导出工具函数和类型
export * from './utils';
export * from './schemas';

// 导出 Actions
export { messageGetByPagination } from './getByPagination';
export { messageGetByPk } from './getByPk';
export { messageCreate } from './create';
export { messageRecall } from './recall';
export { messageGetSchema } from './getSchema';

// 导入所有 actions 用于注册
import { messageGetByPagination } from './getByPagination';
import { messageGetByPk } from './getByPk';
import { messageCreate } from './create';
import { messageRecall } from './recall';
import { messageGetSchema } from './getSchema';

/** 消息模块所有 Actions */
export const messageActions = [
  messageGetByPagination,
  messageGetByPk,
  messageCreate,
  messageRecall,
  messageGetSchema,
];
