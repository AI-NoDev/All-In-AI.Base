/**
 * 用户角色关联模块 Actions
 */

export * from './schemas';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './deleteByPk';
export * from './getSchema';
export * from './getByUserId';
export * from './setByUserId';

import { userRoleGetByPagination } from './getByPagination';
import { userRoleGetByPk } from './getByPk';
import { userRoleCreate } from './create';
import { userRoleCreateMany } from './createMany';
import { userRoleDeleteByPk } from './deleteByPk';
import { userRoleGetSchema } from './getSchema';
import { userRoleGetByUserId } from './getByUserId';
import { userRoleSetByUserId } from './setByUserId';

export const userRoleActions = [
  userRoleGetByPagination,
  userRoleGetByPk,
  userRoleCreate,
  userRoleCreateMany,
  userRoleDeleteByPk,
  userRoleGetSchema,
  userRoleGetByUserId,
  userRoleSetByUserId,
];
