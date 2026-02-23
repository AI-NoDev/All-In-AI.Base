/**
 * MCP服务模块
 */

export * from './schemas';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './update';
export * from './deleteByPk';
export * from './getSchema';
export * from './getConfig';

import { mcpServerGetByPagination } from './getByPagination';
import { mcpServerGetByPk } from './getByPk';
import { mcpServerCreate } from './create';
import { mcpServerUpdate } from './update';
import { mcpServerDeleteByPk } from './deleteByPk';
import { mcpServerGetSchema } from './getSchema';
import { mcpServerGetConfig } from './getConfig';

export const mcpServerActions = [
  mcpServerGetByPagination,
  mcpServerGetByPk,
  mcpServerCreate,
  mcpServerUpdate,
  mcpServerDeleteByPk,
  mcpServerGetSchema,
  mcpServerGetConfig,
];
