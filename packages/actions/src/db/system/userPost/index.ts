/**
 * 用户岗位关联模块 Actions
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './deleteByPk';
export * from './getSchema';
export * from './getByUserId';

import { userPostGetByPagination } from './getByPagination';
import { userPostGetByPk } from './getByPk';
import { userPostCreate } from './create';
import { userPostCreateMany } from './createMany';
import { userPostDeleteByPk } from './deleteByPk';
import { userPostGetSchema } from './getSchema';
import { userPostGetByUserId } from './getByUserId';

export const userPostActions = [
  userPostGetByPagination,
  userPostGetByPk,
  userPostCreate,
  userPostCreateMany,
  userPostDeleteByPk,
  userPostGetSchema,
  userPostGetByUserId,
];
