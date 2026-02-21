/**
 * 系统配置模块 Actions
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './update';
export * from './updateMany';
export * from './deleteByPk';
export * from './getSchema';

import { configGetByPagination } from './getByPagination';
import { configGetByPk } from './getByPk';
import { configCreate } from './create';
import { configCreateMany } from './createMany';
import { configUpdate } from './update';
import { configUpdateMany } from './updateMany';
import { configDeleteByPk } from './deleteByPk';
import { configGetSchema } from './getSchema';

export const configActions = [
  configGetByPagination,
  configGetByPk,
  configCreate,
  configCreateMany,
  configUpdate,
  configUpdateMany,
  configDeleteByPk,
  configGetSchema,
];
