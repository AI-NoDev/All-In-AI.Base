/**
 * Legacy types for backward compatibility with flow-editor
 * These types support the full Zod schema structure (8 types)
 */
export type LegacyFieldType = 'string' | 'number' | 'boolean' | 'literal' | 'enum' | 'array' | 'union' | 'object';
/** 基础 Schema 属性 */
interface BaseSchema {
    id: string;
    type: LegacyFieldType;
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
/** Array 类型 */
export interface ArraySchema extends BaseSchema {
    type: 'array';
    item: SchemaType;
}
/** Union 类型 */
export interface UnionSchema extends BaseSchema {
    type: 'union';
    options: SchemaType[];
}
/** Object 类型 */
export interface ObjectSchema extends BaseSchema {
    type: 'object';
    fields: Field[];
}
/** SchemaType = 无 name 的类型 */
export type SchemaType = StringSchema | NumberSchema | BooleanSchema | LiteralSchema | EnumSchema | ArraySchema | UnionSchema | ObjectSchema;
/** Field = SchemaType + name */
export type Field = SchemaType & {
    name: string;
};
/** 根 Schema */
export interface RootSchema {
    type: 'object';
    id: 'root';
    fields: Field[];
}
export declare const LEGACY_TYPE_ICONS: Record<LegacyFieldType, string>;
export declare function generateId(): string;
/** 创建 SchemaType（无 name） */
export declare function createSchemaType(type: LegacyFieldType): SchemaType;
/** 创建 Field（有 name） */
export declare function createField(type: LegacyFieldType, name?: string): Field;
/** 创建根 Schema */
export declare function createRootSchema(): RootSchema;
/** 深拷贝 SchemaType */
export declare function cloneSchemaType(schema: SchemaType): SchemaType;
/** 深拷贝 Field */
export declare function cloneField(field: Field): Field;
export {};
