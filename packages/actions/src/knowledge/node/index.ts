/**
 * 知识库节点 Actions
 * 
 * 标准 CRUD 操作，统一处理文件和文件夹
 */

export * from './schemas';
export { nodeGetByPagination } from './getByPagination';
export { nodeGetChildren } from './getChildren';
export { nodeGetByPk } from './getByPk';
export { nodeCreate } from './create';
export { nodeUpdate } from './update';
export { nodeDelete } from './deleteByPk';
export { nodeDeleteMany } from './deleteMany';
export { nodeGetSchema } from './getSchema';

import { nodeGetByPagination } from './getByPagination';
import { nodeGetChildren } from './getChildren';
import { nodeGetByPk } from './getByPk';
import { nodeCreate } from './create';
import { nodeUpdate } from './update';
import { nodeDelete } from './deleteByPk';
import { nodeDeleteMany } from './deleteMany';
import { nodeGetSchema } from './getSchema';

export const nodeActions = [
  nodeGetByPagination,
  nodeGetChildren,
  nodeGetByPk,
  nodeCreate,
  nodeUpdate,
  nodeDelete,
  nodeDeleteMany,
  nodeGetSchema,
];
