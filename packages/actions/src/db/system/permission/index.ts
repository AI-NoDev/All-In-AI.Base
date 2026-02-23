/**
 * 权限模块 Actions
 */

export * from './schemas';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './update';
export * from './deleteByPk';
export * from './getTree';
export * from './getSchema';

import { permissionGetByPagination } from './getByPagination';
import { permissionGetByPk } from './getByPk';
import { permissionCreate } from './create';
import { permissionUpdate } from './update';
import { permissionDeleteByPk } from './deleteByPk';
import { permissionGetTree } from './getTree';
import { permissionGetSchema } from './getSchema';

export const permissionActions = [
  permissionGetByPagination,
  permissionGetByPk,
  permissionCreate,
  permissionUpdate,
  permissionDeleteByPk,
  permissionGetTree,
  permissionGetSchema,
];
