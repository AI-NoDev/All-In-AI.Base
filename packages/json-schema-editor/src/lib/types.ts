/**
 * JSON Schema Editor - 简化数据结构
 * 
 * 仅支持 5 种类型（AJV 兼容）：
 * - string（文本）
 * - number（数字）
 * - boolean（布尔）
 * - array（列表）
 * - object（对象/分组）
 */

export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

/** String format 类型 */
export type StringFormat = 'none' | 'email' | 'uri' | 'date' | 'date-time' | 'time' | 'uuid' | 'hostname' | 'ipv4' | 'ipv6';

/** 基础字段属性 */
export interface BaseField {
  id: string;
  name: string;
  type: FieldType;
  description?: string;
  required: boolean;
}

/** String 类型 */
export interface StringField extends BaseField {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  format?: StringFormat;
  enum?: string[];
}

/** Number 类型 */
export interface NumberField extends BaseField {
  type: 'number';
  minimum?: number;
  maximum?: number;
  enum?: number[];
}

/** Boolean 类型 */
export interface BooleanField extends BaseField {
  type: 'boolean';
  allowTrue?: boolean;
  allowFalse?: boolean;
}

/** Array 类型 */
export interface ArrayField extends BaseField {
  type: 'array';
  items: Field;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

/** Object 类型 */
export interface ObjectField extends BaseField {
  type: 'object';
  properties: Field[];
}

/** 字段联合类型 */
export type Field = StringField | NumberField | BooleanField | ArrayField | ObjectField;

/** 根 Schema */
export interface JsonSchema {
  $schema?: string;
  type: 'object';
  properties: Field[];
  title?: string;
  description?: string;
}

// ==================== 常量 ====================

export const TYPE_ICONS: Record<FieldType, string> = {
  string: 'mdi:format-text',
  number: 'mdi:numeric',
  boolean: 'mdi:toggle-switch-outline',
  array: 'mdi:code-brackets',
  object: 'mdi:code-braces',
};

export const TYPE_LABELS: Record<FieldType, { zh: string; en: string }> = {
  string: { zh: '文本', en: 'Text' },
  number: { zh: '数字', en: 'Number' },
  boolean: { zh: '是/否', en: 'Yes/No' },
  array: { zh: '列表', en: 'List' },
  object: { zh: '分组', en: 'Group' },
};

// CSS variable-based type colors for theme compatibility
// These map to common shadcn/tailwind semantic colors
export const TYPE_COLOR_CLASSES: Record<FieldType, { bg: string; text: string; border: string }> = {
  string: { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/40' },
  number: { bg: 'bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/40' },
  boolean: { bg: 'bg-green-500/15', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/40' },
  array: { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/40' },
  object: { bg: 'bg-red-500/15', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/40' },
};

// Legacy hex colors (kept for backward compatibility)
export const TYPE_COLORS: Record<FieldType, string> = {
  string: '#3b82f6', // blue
  number: '#8b5cf6', // purple
  boolean: '#22c55e', // green
  array: '#f59e0b', // amber
  object: '#ef4444', // red
};

export const STRING_FORMATS: { value: StringFormat; label: { zh: string; en: string } }[] = [
  { value: 'none', label: { zh: '无', en: 'None' } },
  { value: 'email', label: { zh: '邮箱', en: 'Email' } },
  { value: 'uri', label: { zh: 'URL', en: 'URL' } },
  { value: 'date', label: { zh: '日期', en: 'Date' } },
  { value: 'date-time', label: { zh: '日期时间', en: 'Date-Time' } },
  { value: 'time', label: { zh: '时间', en: 'Time' } },
  { value: 'uuid', label: { zh: 'UUID', en: 'UUID' } },
  { value: 'hostname', label: { zh: '主机名', en: 'Hostname' } },
  { value: 'ipv4', label: { zh: 'IPv4', en: 'IPv4' } },
  { value: 'ipv6', label: { zh: 'IPv6', en: 'IPv6' } },
];

// ==================== 工具函数 ====================

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `f_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/** 创建字段 */
export function createField(type: FieldType, name: string = ''): Field {
  const base = {
    id: generateId(),
    name,
    description: '',
    required: false,
  };

  switch (type) {
    case 'string':
      return { ...base, type: 'string', format: 'none' as StringFormat, enum: [] };
    case 'number':
      return { ...base, type: 'number', enum: [] };
    case 'boolean':
      return { ...base, type: 'boolean', allowTrue: true, allowFalse: true };
    case 'array':
      return { ...base, type: 'array', items: createField('string', 'item'), uniqueItems: false };
    case 'object':
      return { ...base, type: 'object', properties: [] };
  }
}

/** 创建根 Schema */
export function createSchema(): JsonSchema {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: [],
  };
}

/** 深拷贝字段 */
export function cloneField(field: Field): Field {
  const cloned = { ...field, id: generateId() };

  if (cloned.type === 'object') {
    cloned.properties = cloned.properties.map(cloneField);
  }
  if (cloned.type === 'array') {
    cloned.items = cloneField(cloned.items);
  }

  return cloned as Field;
}
