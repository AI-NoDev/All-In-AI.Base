import { z } from 'zod';

/**
 * Filter Zod Schema 构建工具
 * 用于为每个表创建类型安全的 Filter schema
 */

// ============ 基础 Operator Schema ============
export const filterOperatorSchema = z.enum([
  'eq', 'ne', 'lt', 'lte', 'gt', 'gte',
  'in', 'nin', 'contains', 'icontains',
  'startswith', 'endswith', 'isnull'
]);

// ============ 创建 FieldFilter Schema ============
export function createFieldFilterSchema<T extends readonly [string, ...string[]]>(fields: T) {
  return z.object({
    type: z.literal('field'),
    field: z.enum(fields),
    operator: filterOperatorSchema,
    value: z.unknown().optional(),
  });
}

// ============ 创建递归 FilterNode Schema ============
export function createFilterNodeSchema<T extends readonly [string, ...string[]]>(fields: T) {
  const fieldFilterSchema = createFieldFilterSchema(fields);
  
  // 使用 z.lazy 实现递归
  const filterNodeSchema: z.ZodType<FilterNodeType<T[number]>> = z.lazy(() =>
    z.discriminatedUnion('type', [
      fieldFilterSchema,
      z.object({
        type: z.literal('logic'),
        operator: z.enum(['and', 'or']),
        filters: z.array(filterNodeSchema).min(1),
      }),
      z.object({
        type: z.literal('not'),
        filter: filterNodeSchema,
      }),
    ])
  );
  
  return filterNodeSchema;
}

// ============ 创建 Sort Schema ============
export function createSortSchema<T extends readonly [string, ...string[]]>(fields: T) {
  return z.object({
    field: z.enum(fields),
    order: z.enum(['asc', 'desc']),
  });
}

// ============ 创建完整 Query Schema ============
export function createQuerySchema<T extends readonly [string, ...string[]]>(fields: T) {
  const filterNodeSchema = createFilterNodeSchema(fields);
  const sortSchema = createSortSchema(fields);
  
  return z.object({
    filter: filterNodeSchema.optional(),
    sort: z.array(sortSchema).optional(),
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(100).default(20),
  });
}

// ============ 辅助类型 ============
type FieldFilterType<TField extends string> = {
  type: 'field';
  field: TField;
  operator: z.infer<typeof filterOperatorSchema>;
  value?: unknown;
};

type LogicalFilterType<TField extends string> = {
  type: 'logic';
  operator: 'and' | 'or';
  filters: FilterNodeType<TField>[];
};

type NotFilterType<TField extends string> = {
  type: 'not';
  filter: FilterNodeType<TField>;
};

type FilterNodeType<TField extends string> =
  | FieldFilterType<TField>
  | LogicalFilterType<TField>
  | NotFilterType<TField>;
