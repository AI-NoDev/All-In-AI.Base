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
export declare const TYPE_ICONS: Record<FieldType, string>;
export declare const TYPE_LABELS: Record<FieldType, {
    zh: string;
    en: string;
}>;
export declare const TYPE_COLOR_CLASSES: Record<FieldType, {
    bg: string;
    text: string;
    border: string;
}>;
export declare const TYPE_COLORS: Record<FieldType, string>;
export declare const STRING_FORMATS: {
    value: StringFormat;
    label: {
        zh: string;
        en: string;
    };
}[];
export declare function generateId(): string;
/** 创建字段 */
export declare function createField(type: FieldType, name?: string): Field;
/** 创建根 Schema */
export declare function createSchema(): JsonSchema;
/** 深拷贝字段 */
export declare function cloneField(field: Field): Field;
