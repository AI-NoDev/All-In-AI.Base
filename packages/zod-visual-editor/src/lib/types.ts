/**
 * Zod Visual Editor - 简化数据结构（中间层）
 * 
 * 数据流：
 * 1. 用户编辑 → RootSchema（简化数据结构）
 * 2. RootSchema → Zod Schema（运行时验证）
 * 3. RootSchema → JSON Schema（API 文档）
 * 
 * 支持的类型：
 * - string / number / boolean（基础标量）
 * - literal（字面量）
 * - enum（枚举）
 * - array（数组，必须有子类型）
 * - union（联合，必须有子类型列表）
 * - object（对象，字段可嵌套）
 */

export type FieldType = 'string' | 'number' | 'boolean' | 'literal' | 'enum' | 'array' | 'union' | 'object';

/** 基础 Schema 属性 */
interface BaseSchema {
  id: string;
  type: FieldType;
  description?: string;
  optional?: boolean;
}

/** String 类型 */
export interface StringSchema extends BaseSchema {
  type: 'string';
}

/** Number 类型 */
export interface NumberSchema extends BaseSchema {
  type: 'number';
}

/** Boolean 类型 */
export interface BooleanSchema extends BaseSchema {
  type: 'boolean';
}

/** Literal 类型 */
export interface LiteralSchema extends BaseSchema {
  type: 'literal';
  value: string | number | boolean;
}

/** Enum 类型 */
export interface EnumSchema extends BaseSchema {
  type: 'enum';
  values: Array<string | number>;
}

/** Array 类型（子类型无 name） */
export interface ArraySchema extends BaseSchema {
  type: 'array';
  item: SchemaType;
}

/** Union 类型（子类型无 name） */
export interface UnionSchema extends BaseSchema {
  type: 'union';
  options: SchemaType[];
}

/** Object 类型（字段有 name） */
export interface ObjectSchema extends BaseSchema {
  type: 'object';
  fields: Field[];
}

/** SchemaType = 无 name 的类型（用于 array.item, union.options） */
export type SchemaType =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | LiteralSchema
  | EnumSchema
  | ArraySchema
  | UnionSchema
  | ObjectSchema;

/** Field = SchemaType + name（用于 object.fields） */
export type Field = SchemaType & { name: string };

/** 根 Schema */
export interface RootSchema {
  type: 'object';
  id: 'root';
  fields: Field[];
}

// ==================== 常量 ====================

export const TYPE_ICONS: Record<FieldType, string> = {
  string: 'mdi:format-text',
  number: 'mdi:numeric',
  boolean: 'mdi:toggle-switch-outline',
  literal: 'mdi:format-quote-close',
  enum: 'mdi:format-list-bulleted',
  array: 'mdi:code-brackets',
  union: 'mdi:set-split',
  object: 'mdi:code-braces',
};

// ==================== 工具函数 ====================

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `f_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/** 创建 SchemaType（无 name） */
export function createSchemaType(type: FieldType): SchemaType {
  const id = generateId();

  switch (type) {
    case 'string':
      return { id, type: 'string' };
    case 'number':
      return { id, type: 'number' };
    case 'boolean':
      return { id, type: 'boolean' };
    case 'literal':
      return { id, type: 'literal', value: '' };
    case 'enum':
      return { id, type: 'enum', values: [] };
    case 'array':
      return { id, type: 'array', item: createSchemaType('string') };
    case 'union':
      return { id, type: 'union', options: [createSchemaType('string')] };
    case 'object':
      return { id, type: 'object', fields: [] };
  }
}

/** 创建 Field（有 name） */
export function createField(type: FieldType, name: string = ''): Field {
  return { ...createSchemaType(type), name } as Field;
}

/** 创建根 Schema */
export function createRootSchema(): RootSchema {
  return { type: 'object', id: 'root', fields: [] };
}

/** 深拷贝 SchemaType */
export function cloneSchemaType(schema: SchemaType): SchemaType {
  const cloned = { ...schema, id: generateId() } as SchemaType;

  if (cloned.type === 'object') {
    cloned.fields = cloned.fields.map(cloneField);
  }
  if (cloned.type === 'array') {
    cloned.item = cloneSchemaType(cloned.item);
  }
  if (cloned.type === 'union') {
    cloned.options = cloned.options.map(cloneSchemaType);
  }

  return cloned;
}

/** 深拷贝 Field */
export function cloneField(field: Field): Field {
  return { ...cloneSchemaType(field), name: field.name } as Field;
}
