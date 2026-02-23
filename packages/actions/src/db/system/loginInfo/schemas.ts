/**
 * 登录日志模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { loginInfoSchemas, type LoginInfoSelect, type LoginInfoInsert } from '@qiyu-allinai/db/entities/system/loginInfo';

/** 登录日志过滤条件 Schema */
export const loginInfoFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '日志ID' }), { description: '日志ID列表，批量查询' })),
  loginNames: t.Optional(t.Array(t.String({ description: '登录账号' }), { description: '登录账号列表，批量查询' })),
  status: t.Optional(t.Union([t.Literal('0'), t.Literal('1')], { description: '状态：0=成功，1=失败' })),
  loginName: t.Optional(t.String({ description: '登录账号（模糊匹配）' })),
  ipaddr: t.Optional(t.String({ description: 'IP地址（模糊匹配）' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间结束' })),
  loginTimeStart: t.Optional(t.String({ description: '登录时间起始' })),
  loginTimeEnd: t.Optional(t.String({ description: '登录时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const loginInfoSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('loginName'), t.Literal('ipaddr'), t.Literal('loginTime'), t.Literal('createdAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const loginInfoPaginationBodySchema = t.Object({
  filter: loginInfoFilterSchema,
  sort: loginInfoSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
