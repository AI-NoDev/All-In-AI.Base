/**
 * AI模型模块
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
export * from './test';

import { modelGetByPagination } from './getByPagination';
import { modelGetByPk } from './getByPk';
import { modelCreate } from './create';
import { modelCreateMany } from './createMany';
import { modelUpdate } from './update';
import { modelUpdateMany } from './updateMany';
import { modelDeleteByPk } from './deleteByPk';
import { modelGetSchema } from './getSchema';
import { modelTest } from './test';

export const modelActions = [
  modelGetByPagination,
  modelGetByPk,
  modelCreate,
  modelCreateMany,
  modelUpdate,
  modelUpdateMany,
  modelDeleteByPk,
  modelGetSchema,
  modelTest,
];
