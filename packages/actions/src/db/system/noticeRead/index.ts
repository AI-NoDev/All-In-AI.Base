/**
 * 通知已读记录模块 Actions
 */

export * from './schemas';
export * from './utils';
export * from './markAsRead';
export * from './markManyAsRead';
export * from './getUnreadCount';

import { noticeReadMarkAsRead } from './markAsRead';
import { noticeReadMarkManyAsRead } from './markManyAsRead';
import { noticeReadGetUnreadCount } from './getUnreadCount';

export const noticeReadActions = [
  noticeReadMarkAsRead,
  noticeReadMarkManyAsRead,
  noticeReadGetUnreadCount,
];
