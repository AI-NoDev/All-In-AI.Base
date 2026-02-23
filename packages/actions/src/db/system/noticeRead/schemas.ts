/**
 * 通知已读记录模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { noticeReadSchemas, type NoticeReadSelect, type NoticeReadInsert } from '@qiyu-allinai/db/entities/system/noticeRead';

/** 标记已读请求体 Schema */
export const markAsReadBodySchema = t.Object({
  noticeId: t.String({ format: 'uuid', description: '通知ID' }),
});

/** 批量标记已读请求体 Schema */
export const markManyAsReadBodySchema = t.Object({
  noticeIds: t.Array(t.String({ format: 'uuid' }), { description: '通知ID列表' }),
});

/** 获取未读数量响应 Schema */
export const unreadCountOutputSchema = t.Object({
  count: t.Number({ description: '未读数量' }),
});
