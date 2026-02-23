/**
 * 通知公告模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { noticeTypeboxSchemas, type NoticeSelect, type NoticeInsert } from '@qiyu-allinai/db/entities/system/notice';

/** 通知过滤条件 Schema */
export const noticeFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '通知ID' }), { description: '通知ID列表，批量查询' })),
  titles: t.Optional(t.Array(t.String({ description: '标题' }), { description: '标题列表，批量查询' })),
  types: t.Optional(t.Array(t.String({ description: '类型' }), { description: '类型列表：1=通知，2=公告' })),
  type: t.Optional(t.String({ description: '类型：1=通知，2=公告' })),
  status: t.Optional(t.Union([t.Literal('0'), t.Literal('1')], { description: '状态：0=正常，1=关闭' })),
  title: t.Optional(t.String({ description: '标题（模糊匹配）' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const noticeSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('title'), t.Literal('type'), t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const noticePaginationBodySchema = t.Object({
  filter: noticeFilterSchema,
  sort: noticeSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
