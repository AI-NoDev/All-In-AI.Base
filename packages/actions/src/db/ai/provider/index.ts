/**
 * AI提供商模块
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

import { providerGetByPagination } from './getByPagination';
import { providerGetByPk } from './getByPk';
import { providerCreate } from './create';
import { providerCreateMany } from './createMany';
import { providerUpdate } from './update';
import { providerUpdateMany } from './updateMany';
import { providerDeleteByPk } from './deleteByPk';
import { providerGetSchema } from './getSchema';

export const providerActions = [
  providerGetByPagination,
  providerGetByPk,
  providerCreate,
  providerCreateMany,
  providerUpdate,
  providerUpdateMany,
  providerDeleteByPk,
  providerGetSchema,
];
