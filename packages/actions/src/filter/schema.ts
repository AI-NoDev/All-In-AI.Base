import { t } from 'elysia';
import { Type, type TSchema } from '@sinclair/typebox';

/**
 * Filter TypeBox Schema 构建工具
 * 用于为每个表创建类型安全的 Filter schema
 */

// ============ 基础 Operator Schema ============
export const filterOperatorSchema = t.Union([
  t.Literal('eq'),
  t.Literal('ne'),
  t.Literal('lt'),
  t.Literal('lte'),
  t.Literal('gt'),
  t.Literal('gte'),
  t.Literal('in'),
  t.Literal('nin'),
  t.Literal('contains'),
  t.Literal('icontains'),
  t.Literal('startswith'),
  t.Literal('endswith'),
  t.Literal('isnull'),
]);

// ============ 创建 FieldFilter Schema ============
export function createFieldFilterSchema<T extends readonly string[]>(fields: T) {
  return t.Object({
    type: t.Literal('field'),
    field: t.Union(fields.map(f => t.Literal(f)) as [TSchema, ...TSchema[]]),
    operator: filterOperatorSchema,
    value: t.Optional(t.Unknown()),
  });
}

// ============ 创建 Sort Schema ============
export function createSortSchema<T extends readonly string[]>(fields: T) {
  return t.Object({
    field: t.Union(fields.map(f => t.Literal(f)) as [TSchema, ...TSchema[]]),
    order: t.Union([t.Literal('asc'), t.Literal('desc')]),
  });
}

// ============ 创建完整 Query Schema ============
// 注意：TypeBox 不支持递归类型，简化为单层 filter
export function createQuerySchema<T extends readonly string[]>(fields: T) {
  const fieldFilterSchema = createFieldFilterSchema(fields);
  const sortSchema = createSortSchema(fields);
  
  return t.Object({
    filter: t.Optional(t.Array(fieldFilterSchema)),
    sort: t.Optional(t.Array(sortSchema)),
    offset: t.Number({ minimum: 0, default: 0 }),
    limit: t.Number({ minimum: 1, maximum: 100, default: 20 }),
  });
}
