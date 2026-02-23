/**
 * 菜单模块 Schema 定义 (TypeBox)
 */

import { t } from 'elysia';

// Re-export from entity for convenience
export { menuSchemas, type MenuSelect, type MenuInsert } from '@qiyu-allinai/db/entities/system/menu';

/** 菜单过滤条件 Schema */
export const menuFilterSchema = t.Optional(t.Object({
  ids: t.Optional(t.Array(t.String({ description: '菜单 ID' }), { description: '菜单 ID 列表，批量查询' })),
  names: t.Optional(t.Array(t.String({ description: '菜单名称' }), { description: '菜单名称列表，批量查询' })),
  types: t.Optional(t.Array(t.String({ description: '菜单类型' }), { description: '菜单类型列表：M=目录，C=菜单，F=按钮' })),
  parentId: t.Optional(t.Union([t.String(), t.Null()], { description: '父级菜单 ID，null 表示顶级菜单' })),
  type: t.Optional(t.String({ description: '菜单类型：M=目录，C=菜单，F=按钮' })),
  visible: t.Optional(t.Boolean({ description: '是否可见' })),
  name: t.Optional(t.String({ description: '菜单名称（模糊匹配）' })),
  createdAtStart: t.Optional(t.String({ description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ description: '创建时间结束' })),
}, { description: '过滤条件' }));

/** 排序 Schema */
export const menuSortSchema = t.Optional(t.Object({
  field: t.Union([
    t.Literal('name'), t.Literal('orderNum'),
    t.Literal('createdAt'), t.Literal('updatedAt'),
  ], { description: '排序字段' }),
  order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
}, { description: '排序配置' }));

/** 分页查询请求体 Schema */
export const menuPaginationBodySchema = t.Object({
  filter: menuFilterSchema,
  sort: menuSortSchema,
  offset: t.Number({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});
