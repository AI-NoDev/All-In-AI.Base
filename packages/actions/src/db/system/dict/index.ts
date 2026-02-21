/**
 * 字典模块
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

import { dictGetByPagination } from './getByPagination';
import { dictGetByPk } from './getByPk';
import { dictCreate } from './create';
import { dictCreateMany } from './createMany';
import { dictUpdate } from './update';
import { dictUpdateMany } from './updateMany';
import { dictDeleteByPk } from './deleteByPk';
import { dictGetSchema } from './getSchema';

export const dictActions = [
  dictGetByPagination,
  dictGetByPk,
  dictCreate,
  dictCreateMany,
  dictUpdate,
  dictUpdateMany,
  dictDeleteByPk,
  dictGetSchema,
];
