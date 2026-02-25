/**
 * Legacy types for backward compatibility with flow-editor
 * These types support the full Zod schema structure (8 types)
 */
// ==================== 常量 ====================
export const LEGACY_TYPE_ICONS = {
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
export function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return `f_${crypto.randomUUID().slice(0, 8)}`;
    }
    return `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
/** 创建 SchemaType（无 name） */
export function createSchemaType(type) {
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
export function createField(type, name = '') {
    return { ...createSchemaType(type), name };
}
/** 创建根 Schema */
export function createRootSchema() {
    return { type: 'object', id: 'root', fields: [] };
}
/** 深拷贝 SchemaType */
export function cloneSchemaType(schema) {
    const cloned = { ...schema, id: generateId() };
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
export function cloneField(field) {
    return { ...cloneSchemaType(field), name: field.name };
}
