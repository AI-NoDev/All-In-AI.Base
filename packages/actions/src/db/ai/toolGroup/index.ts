/**
 * 工具组模块 Actions
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

import { toolGroupGetByPagination } from './getByPagination';
import { toolGroupGetByPk } from './getByPk';
import { toolGroupCreate } from './create';
import { toolGroupCreateMany } from './createMany';
import { toolGroupUpdate } from './update';
import { toolGroupUpdateMany } from './updateMany';
import { toolGroupDeleteByPk } from './deleteByPk';
import { toolGroupGetSchema } from './getSchema';

export const toolGroupActions = [
  toolGroupGetByPagination,
  toolGroupGetByPk,
  toolGroupCreate,
  toolGroupCreateMany,
  toolGroupUpdate,
  toolGroupUpdateMany,
  toolGroupDeleteByPk,
  toolGroupGetSchema,
];
