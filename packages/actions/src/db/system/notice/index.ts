/**
 * 通知公告模块 Actions
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
export * from './getMyNotices';
export * from './publish';
export * from './withdraw';

import { noticeGetByPagination } from './getByPagination';
import { noticeGetByPk } from './getByPk';
import { noticeCreate } from './create';
import { noticeCreateMany } from './createMany';
import { noticeUpdate } from './update';
import { noticeUpdateMany } from './updateMany';
import { noticeDeleteByPk } from './deleteByPk';
import { noticeGetSchema } from './getSchema';
import { noticeGetMyNotices } from './getMyNotices';
import { noticePublish } from './publish';
import { noticeWithdraw } from './withdraw';

export const noticeActions = [
  noticeGetByPagination,
  noticeGetByPk,
  noticeCreate,
  noticeCreateMany,
  noticeUpdate,
  noticeUpdateMany,
  noticeDeleteByPk,
  noticeGetSchema,
  noticeGetMyNotices,
  noticePublish,
  noticeWithdraw,
];
