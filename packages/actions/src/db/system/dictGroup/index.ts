/**
 * 字典组模块 Actions
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

import { dictGroupGetByPagination } from './getByPagination';
import { dictGroupGetByPk } from './getByPk';
import { dictGroupCreate } from './create';
import { dictGroupCreateMany } from './createMany';
import { dictGroupUpdate } from './update';
import { dictGroupUpdateMany } from './updateMany';
import { dictGroupDeleteByPk } from './deleteByPk';
import { dictGroupGetSchema } from './getSchema';

export const dictGroupActions = [
  dictGroupGetByPagination,
  dictGroupGetByPk,
  dictGroupCreate,
  dictGroupCreateMany,
  dictGroupUpdate,
  dictGroupUpdateMany,
  dictGroupDeleteByPk,
  dictGroupGetSchema,
];
