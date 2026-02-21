/**
 * 智能体模块 Actions
 */

// 导出各个 action
export { agentGetByPagination } from './getByPagination';
export { agentGetByPk } from './getByPk';
export { agentCreate } from './create';
export { agentCreateMany } from './createMany';
export { agentUpdate } from './update';
export { agentUpdateMany } from './updateMany';
export { agentDeleteByPk } from './deleteByPk';
export { agentGetSchema } from './getSchema';

// 导出工具函数和类型
export * from './utils';
export * from './schemas';

// 导入所有 actions 用于注册
import { agentGetByPagination } from './getByPagination';
import { agentGetByPk } from './getByPk';
import { agentCreate } from './create';
import { agentCreateMany } from './createMany';
import { agentUpdate } from './update';
import { agentUpdateMany } from './updateMany';
import { agentDeleteByPk } from './deleteByPk';
import { agentGetSchema } from './getSchema';

/** 智能体模块所有 Actions */
export const agentActions = [
  agentGetByPagination,
  agentGetByPk,
  agentCreate,
  agentCreateMany,
  agentUpdate,
  agentUpdateMany,
  agentDeleteByPk,
  agentGetSchema,
];
