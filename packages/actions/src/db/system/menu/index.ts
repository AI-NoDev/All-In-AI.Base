/**
 * 菜单模块
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

import { menuGetByPagination } from './getByPagination';
import { menuGetByPk } from './getByPk';
import { menuCreate } from './create';
import { menuCreateMany } from './createMany';
import { menuUpdate } from './update';
import { menuUpdateMany } from './updateMany';
import { menuDeleteByPk } from './deleteByPk';
import { menuGetSchema } from './getSchema';

export const menuActions = [
  menuGetByPagination,
  menuGetByPk,
  menuCreate,
  menuCreateMany,
  menuUpdate,
  menuUpdateMany,
  menuDeleteByPk,
  menuGetSchema,
];
