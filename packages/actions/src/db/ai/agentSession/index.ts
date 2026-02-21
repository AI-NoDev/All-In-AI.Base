/**
 * Agent会话模块 Actions
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './update';
export * from './archive';
export * from './pin';
export * from './deleteByPk';
export * from './getSchema';

import { agentSessionGetByPagination } from './getByPagination';
import { agentSessionGetByPk } from './getByPk';
import { agentSessionCreate } from './create';
import { agentSessionUpdate } from './update';
import { agentSessionArchive } from './archive';
import { agentSessionPin } from './pin';
import { agentSessionDeleteByPk } from './deleteByPk';
import { agentSessionGetSchema } from './getSchema';

export const agentSessionActions = [
  agentSessionGetByPagination,
  agentSessionGetByPk,
  agentSessionCreate,
  agentSessionUpdate,
  agentSessionArchive,
  agentSessionPin,
  agentSessionDeleteByPk,
  agentSessionGetSchema,
];
