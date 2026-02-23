/**
 * Agent消息模块 Actions
 */

export * from './schemas';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './getHistory';
export * from './deleteByPk';
export * from './deleteFromSeq';
export * from './getSchema';

import { agentMessageGetByPagination } from './getByPagination';
import { agentMessageGetByPk } from './getByPk';
import { agentMessageCreate } from './create';
import { agentMessageCreateMany } from './createMany';
import { agentMessageGetHistory } from './getHistory';
import { agentMessageDeleteByPk } from './deleteByPk';
import { agentMessageDeleteFromSeq } from './deleteFromSeq';
import { agentMessageGetSchema } from './getSchema';

export const agentMessageActions = [
  agentMessageGetByPagination,
  agentMessageGetByPk,
  agentMessageCreate,
  agentMessageCreateMany,
  agentMessageGetHistory,
  agentMessageDeleteByPk,
  agentMessageDeleteFromSeq,
  agentMessageGetSchema,
];
