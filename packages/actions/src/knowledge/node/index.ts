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
export { nodeGetRecycleBin } from './getRecycleBin';
export { nodeRestore } from './restore';
export { nodeDeletePermanently } from './deletePermanently';
export { nodeEmptyRecycleBin } from './emptyRecycleBin';
export { nodeGetSchema } from './getSchema';

import { nodeGetByPagination } from './getByPagination';
import { nodeGetChildren } from './getChildren';
import { nodeGetByPk } from './getByPk';
import { nodeCreate } from './create';
import { nodeUpdate } from './update';
import { nodeDelete } from './deleteByPk';
import { nodeDeleteMany } from './deleteMany';
import { nodeGetRecycleBin } from './getRecycleBin';
import { nodeRestore } from './restore';
import { nodeDeletePermanently } from './deletePermanently';
import { nodeEmptyRecycleBin } from './emptyRecycleBin';
import { nodeGetSchema } from './getSchema';

export const nodeActions = [
  nodeGetByPagination,
  nodeGetChildren,
  nodeGetByPk,
  nodeCreate,
  nodeUpdate,
  nodeDelete,
  nodeDeleteMany,
  nodeGetRecycleBin,
  nodeRestore,
  nodeDeletePermanently,
  nodeEmptyRecycleBin,
  nodeGetSchema,
];
