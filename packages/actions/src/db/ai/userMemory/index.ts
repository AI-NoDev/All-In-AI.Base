/**
 * 用户记忆模块 Actions
 * 
 * 提供用户记忆的 CRUD 操作和语义检索功能
 */

export * from './schemas';
export * from './utils';
export * from './create';
export * from './getByPk';
export * from './getByPagination';
export * from './update';
export * from './deleteByPk';
export * from './semanticSearch';

import { userMemoryCreate } from './create';
import { userMemoryGetByPk } from './getByPk';
import { userMemoryGetByPagination } from './getByPagination';
import { userMemoryUpdate } from './update';
import { userMemoryDeleteByPk } from './deleteByPk';
import { userMemorySemanticSearch } from './semanticSearch';

export const userMemoryActions = [
  userMemoryCreate,
  userMemoryGetByPk,
  userMemoryGetByPagination,
  userMemoryUpdate,
  userMemoryDeleteByPk,
  userMemorySemanticSearch,
];
