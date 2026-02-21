/**
 * 角色菜单关联模块 Actions
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './deleteByPk';
export * from './getSchema';
export * from './getByRoleId';
export * from './setByRoleId';

import { roleMenuGetByPagination } from './getByPagination';
import { roleMenuGetByPk } from './getByPk';
import { roleMenuCreate } from './create';
import { roleMenuCreateMany } from './createMany';
import { roleMenuDeleteByPk } from './deleteByPk';
import { roleMenuGetSchema } from './getSchema';
import { roleMenuGetByRoleId } from './getByRoleId';
import { roleMenuSetByRoleId } from './setByRoleId';

export const roleMenuActions = [
  roleMenuGetByPagination,
  roleMenuGetByPk,
  roleMenuCreate,
  roleMenuCreateMany,
  roleMenuDeleteByPk,
  roleMenuGetSchema,
  roleMenuGetByRoleId,
  roleMenuSetByRoleId,
];
