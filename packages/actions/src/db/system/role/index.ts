/**
 * 角色模块
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

import { roleGetByPagination } from './getByPagination';
import { roleGetByPk } from './getByPk';
import { roleCreate } from './create';
import { roleCreateMany } from './createMany';
import { roleUpdate } from './update';
import { roleUpdateMany } from './updateMany';
import { roleDeleteByPk } from './deleteByPk';
import { roleGetSchema } from './getSchema';

export const roleActions = [
  roleGetByPagination,
  roleGetByPk,
  roleCreate,
  roleCreateMany,
  roleUpdate,
  roleUpdateMany,
  roleDeleteByPk,
  roleGetSchema,
];
