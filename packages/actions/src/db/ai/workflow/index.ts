/**
 * 工作流模块
 */

export * from './schemas';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './update';
export * from './updateMany';
export * from './deleteByPk';
export * from './getSchema';

import { workflowGetByPagination } from './getByPagination';
import { workflowGetByPk } from './getByPk';
import { workflowCreate } from './create';
import { workflowCreateMany } from './createMany';
import { workflowUpdate } from './update';
import { workflowUpdateMany } from './updateMany';
import { workflowDeleteByPk } from './deleteByPk';
import { workflowGetSchema } from './getSchema';

export const workflowActions = [
  workflowGetByPagination,
  workflowGetByPk,
  workflowCreate,
  workflowCreateMany,
  workflowUpdate,
  workflowUpdateMany,
  workflowDeleteByPk,
  workflowGetSchema,
];
