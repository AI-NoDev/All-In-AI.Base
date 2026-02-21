/**
 * AI会话消息模块
 */

export * from './schemas';
export * from './utils';
export * from './getByPagination';
export * from './getByPk';
export * from './create';
export * from './createMany';
export * from './getHistory';
export * from './deleteFromSeq';
export * from './getSchema';

import { aiSessionMessageGetByPagination } from './getByPagination';
import { aiSessionMessageGetByPk } from './getByPk';
import { aiSessionMessageCreate } from './create';
import { aiSessionMessageCreateMany } from './createMany';
import { aiSessionMessageGetHistory } from './getHistory';
import { aiSessionMessageDeleteFromSeq } from './deleteFromSeq';
import { aiSessionMessageGetSchema } from './getSchema';

export const aiSessionMessageActions = [
  aiSessionMessageGetByPagination,
  aiSessionMessageGetByPk,
  aiSessionMessageCreate,
  aiSessionMessageCreateMany,
  aiSessionMessageGetHistory,
  aiSessionMessageDeleteFromSeq,
  aiSessionMessageGetSchema,
];
