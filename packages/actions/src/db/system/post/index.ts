/**
 * 岗位模块 Actions
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

import { postGetByPagination } from './getByPagination';
import { postGetByPk } from './getByPk';
import { postCreate } from './create';
import { postCreateMany } from './createMany';
import { postUpdate } from './update';
import { postUpdateMany } from './updateMany';
import { postDeleteByPk } from './deleteByPk';
import { postGetSchema } from './getSchema';

export const postActions = [
  postGetByPagination,
  postGetByPk,
  postCreate,
  postCreateMany,
  postUpdate,
  postUpdateMany,
  postDeleteByPk,
  postGetSchema,
];
