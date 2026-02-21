/**
 * IM 会话模块
 */

// 导出工具函数和类型
export * from './utils';
export * from './schemas';

// 导出 Actions
export { conversationGetByPagination } from './getByPagination';
export { conversationGetByPk } from './getByPk';
export { conversationCreate } from './create';
export { conversationUpdate } from './update';
export { conversationDeleteByPk } from './deleteByPk';
export { conversationGetSchema } from './getSchema';
export { conversationFindOrCreatePrivate } from './findOrCreatePrivate';
export { conversationCreateGroup } from './createGroup';
export { conversationDissolveGroup } from './dissolveGroup';
export { conversationGetFiles } from './getFiles';

// 导入所有 actions 用于注册
import { conversationGetByPagination } from './getByPagination';
import { conversationGetByPk } from './getByPk';
import { conversationCreate } from './create';
import { conversationUpdate } from './update';
import { conversationDeleteByPk } from './deleteByPk';
import { conversationGetSchema } from './getSchema';
import { conversationFindOrCreatePrivate } from './findOrCreatePrivate';
import { conversationCreateGroup } from './createGroup';
import { conversationDissolveGroup } from './dissolveGroup';
import { conversationGetFiles } from './getFiles';

/** 会话模块所有 Actions */
export const conversationActions = [
  conversationGetByPagination,
  conversationGetByPk,
  conversationCreate,
  conversationUpdate,
  conversationDeleteByPk,
  conversationGetSchema,
  conversationFindOrCreatePrivate,
  conversationCreateGroup,
  conversationDissolveGroup,
  conversationGetFiles,
];
