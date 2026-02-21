/**
 * AI会话模块
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './update';
export * from './delete';
export * from './getSchema';

import { aiSessionGetByPagination } from './getByPagination';
import { aiSessionGetByPk } from './getByPk';
import { aiSessionCreate } from './create';
import { aiSessionUpdate } from './update';
import { aiSessionDelete } from './delete';
import { aiSessionGetSchema } from './getSchema';

export const aiSessionActions = [
  aiSessionGetByPagination,
  aiSessionGetByPk,
  aiSessionCreate,
  aiSessionUpdate,
  aiSessionDelete,
  aiSessionGetSchema,
];
