/**
 * API密钥模块
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './update';
export * from './revoke';
export * from './deleteByPk';
export * from './getSchema';

import { apiKeyGetByPagination } from './getByPagination';
import { apiKeyGetByPk } from './getByPk';
import { apiKeyCreate } from './create';
import { apiKeyUpdate } from './update';
import { apiKeyRevoke } from './revoke';
import { apiKeyDeleteByPk } from './deleteByPk';
import { apiKeyGetSchema } from './getSchema';

export const apiKeyActions = [
  apiKeyGetByPagination,
  apiKeyGetByPk,
  apiKeyCreate,
  apiKeyUpdate,
  apiKeyRevoke,
  apiKeyDeleteByPk,
  apiKeyGetSchema,
];
