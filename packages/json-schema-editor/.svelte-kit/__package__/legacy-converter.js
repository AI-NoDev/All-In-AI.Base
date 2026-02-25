/**
 * Legacy converter - RootSchema ↔ JSON Schema
 * For backward compatibility with flow-editor
 */
import { generateId } from './legacy-types.js';
// ==================== 导出为 JSON Schema ====================
function schemaTypeToJsonSchema(schema) {
    const result = {};
    switch (schema.type) {
        case 'string':
            result.type = 'string';
            break;
        case 'number':
            result.type = 'number';
            break;
        case 'boolean':
            result.type = 'boolean';
            break;
        case 'literal':
            result.const = schema.value;
            break;
        case 'enum':
            result.enum = schema.values;
            break;
        case 'array':
            result.type = 'array';
            result.items = schemaTypeToJsonSchema(schema.item);
            break;
        case 'union':
            result.oneOf = schema.options.map(schemaTypeToJsonSchema);
            break;
        case 'object': {
            result.type = 'object';
            const properties = {};
            const required = [];
            for (const field of schema.fields) {
                properties[field.name] = schemaTypeToJsonSchema(field);
                if (!field.optional) {
                    required.push(field.name);
                }
            }
            result.properties = properties;
            if (required.length > 0) {
                result.required = required;
            }
            break;
        }
    }
    if (schema.description) {
        result.description = schema.description;
    }
    return result;
}
/** 导出为标准 JSON Schema */
export function legacyToJsonSchema(root) {
    const properties = {};
    const required = [];
    for (const field of root.fields) {
        properties[field.name] = schemaTypeToJsonSchema(field);
        if (!field.optional) {
            required.push(field.name);
        }
    }
    return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        properties,
        ...(required.length > 0 ? { required } : {}),
    };
}
// ==================== 从 JSON Schema 解析 ====================
function jsonSchemaToSchemaType(json, name) {
    const id = generateId();
    const description = json.description;
    const type = json.type;
    const nullable = Array.isArray(type) && type.includes('null');
    const actualType = Array.isArray(type) ? type.find(t => t !== 'null') : type;
    let result;
    if (json.const !== undefined) {
        result = { id, type: 'literal', value: json.const };
    }
    else if (json.enum) {
        result = { id, type: 'enum', values: json.enum };
    }
    else if (json.oneOf || json.anyOf) {
        const options = (json.oneOf || json.anyOf).map(o => jsonSchemaToSchemaType(o));
        result = { id, type: 'union', options };
    }
    else if (actualType === 'string') {
        result = { id, type: 'string' };
    }
    else if (actualType === 'number' || actualType === 'integer') {
        result = { id, type: 'number' };
    }
    else if (actualType === 'boolean') {
        result = { id, type: 'boolean' };
    }
    else if (actualType === 'array') {
        const items = json.items;
        const item = items ? jsonSchemaToSchemaType(items) : { id: generateId(), type: 'string' };
        result = { id, type: 'array', item };
    }
    else if (actualType === 'object') {
        const properties = json.properties;
        const required = json.required;
        const fields = [];
        if (properties) {
            for (const [key, value] of Object.entries(properties)) {
                const field = jsonSchemaToSchemaType(value, key);
                field.optional = !required?.includes(key);
                fields.push(field);
            }
        }
        result = { id, type: 'object', fields };
    }
    else {
        result = { id, type: 'string' };
    }
    if (description)
        result.description = description;
    if (nullable)
        result.optional = true;
    if (name !== undefined) {
        return { ...result, name };
    }
    return result;
}
/** 从 JSON Schema 解析为 RootSchema */
export function legacyFromJsonSchema(json) {
    const properties = json.properties;
    const required = json.required;
    const fields = [];
    if (properties) {
        for (const [name, value] of Object.entries(properties)) {
            const field = jsonSchemaToSchemaType(value, name);
            field.optional = !required?.includes(name);
            fields.push(field);
        }
    }
    return { type: 'object', id: 'root', fields };
}
