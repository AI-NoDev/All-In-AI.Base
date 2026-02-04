/**
 * Filter AST 类型定义
 * 用于构建类型安全的查询条件
 */

// ============ Filter Operators ============
export type FilterOperator =
  | 'eq'        // 等于
  | 'ne'        // 不等于
  | 'lt'        // 小于
  | 'lte'       // 小于等于
  | 'gt'        // 大于
  | 'gte'       // 大于等于
  | 'in'        // 在列表中
  | 'nin'       // 不在列表中
  | 'contains'  // 包含（区分大小写）
  | 'icontains' // 包含（不区分大小写）
  | 'startswith'// 以...开头
  | 'endswith'  // 以...结尾
  | 'isnull';   // 是否为空

// ============ 字段类型对应的运算符 ============
export const OperatorsByFieldType = {
  uuid: ['eq', 'ne', 'in', 'nin', 'isnull'],
  string: ['eq', 'ne', 'in', 'nin', 'contains', 'icontains', 'startswith', 'endswith', 'isnull'],
  number: ['eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'in', 'nin', 'isnull'],
  boolean: ['eq', 'ne', 'isnull'],
  datetime: ['eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'isnull'],
  enum: ['eq', 'ne', 'in', 'nin'],
  json: ['isnull'],
} as const;

// ============ 原子字段过滤条件 ============
export interface FieldFilter<TField extends string = string> {
  type: 'field';
  field: TField;
  operator: FilterOperator;
  value?: unknown;
}

// ============ 逻辑组合 (AND / OR) ============
export interface LogicalFilter<TField extends string = string> {
  type: 'logic';
  operator: 'and' | 'or';
  filters: FilterNode<TField>[];
}

// ============ NOT 过滤 ============
export interface NotFilter<TField extends string = string> {
  type: 'not';
  filter: FilterNode<TField>;
}

// ============ 统一 FilterNode (递归 AST) ============
export type FilterNode<TField extends string = string> =
  | FieldFilter<TField>
  | LogicalFilter<TField>
  | NotFilter<TField>;

// ============ 排序 ============
export interface Sort<TField extends string = string> {
  field: TField;
  order: 'asc' | 'desc';
}

// ============ 分页参数 ============
export interface Pagination {
  offset: number;
  limit: number;
}

// ============ 完整查询参数 ============
export interface QueryParams<TField extends string = string> {
  filter?: FilterNode<TField>;
  sort?: Sort<TField>[];
  offset?: number;
  limit?: number;
}
