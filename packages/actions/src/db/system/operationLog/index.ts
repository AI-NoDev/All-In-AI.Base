/**
 * 操作日志模块 Actions
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './deleteByPk';
export * from './getSchema';

import { operationLogGetByPagination } from './getByPagination';
import { operationLogGetByPk } from './getByPk';
import { operationLogCreate } from './create';
import { operationLogDeleteByPk } from './deleteByPk';
import { operationLogGetSchema } from './getSchema';

export const operationLogActions = [
  operationLogGetByPagination,
  operationLogGetByPk,
  operationLogCreate,
  operationLogDeleteByPk,
  operationLogGetSchema,
];
