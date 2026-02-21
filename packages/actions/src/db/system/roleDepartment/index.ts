/**
 * 角色部门关联模块 Actions
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './deleteByPk';
export * from './getSchema';

import { roleDepartmentGetByPagination } from './getByPagination';
import { roleDepartmentGetByPk } from './getByPk';
import { roleDepartmentCreate } from './create';
import { roleDepartmentCreateMany } from './createMany';
import { roleDepartmentDeleteByPk } from './deleteByPk';
import { roleDepartmentGetSchema } from './getSchema';

export const roleDepartmentActions = [
  roleDepartmentGetByPagination,
  roleDepartmentGetByPk,
  roleDepartmentCreate,
  roleDepartmentCreateMany,
  roleDepartmentDeleteByPk,
  roleDepartmentGetSchema,
];
