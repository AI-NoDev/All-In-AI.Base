/**
 * 用户模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

/** 用户过滤条件 Schema */
export const userFilterSchema = t.Optional(t.Object({
  // IN 查询
  ids: t.Optional(t.Array(t.String({ description: '用户 ID' }), { description: '用户 ID 列表，批量查询' })),
  loginNames: t.Optional(t.Array(t.String({ description: '登录名' }), { description: '登录名列表，批量查询' })),
  // 精确匹配
  deptId: t.Optional(t.String({ description: '部门 ID' })),
  userType: t.Optional(t.String({ description: '用户类型：00=系统管理员，01=普通用户' })),
  sex: t.Optional(t.String({ description: '性别：0=男，1=女，2=未知' })),
  status: t.Optional(t.String({ description: '状态：0=正常，1=禁用' })),
  // 模糊匹配
  loginName: t.Optional(t.String({ description: '登录名（模糊匹配）' })),
  name: t.Optional(t.String({ description: '用户名（模糊匹配）' })),
  email: t.Optional(t.String({ description: '邮箱（模糊匹配）' })),
  phonenumber: t.Optional(t.String({ description: '手机号（模糊匹配）' })),
  // 时间范围
  createdAtStart: t.Optional(t.String({ format: 'date-time', description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ format: 'date-time', description: '创建时间结束' })),
  loginDateStart: t.Optional(t.String({ format: 'date-time', description: '最后登录时间起始' })),
  loginDateEnd: t.Optional(t.String({ format: 'date-time', description: '最后登录时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const sortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('loginName'),
    t.Literal('name'),
    t.Literal('createdAt'),
    t.Literal('updatedAt'),
    t.Literal('loginDate'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询 Body Schema */
export const paginationBodySchema = t.Object({
  filter: userFilterSchema,
  sort: sortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
