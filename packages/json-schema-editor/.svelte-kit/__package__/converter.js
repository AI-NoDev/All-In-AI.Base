/**
 * 转换器 - 内部格式与 JSON Schema 互转
 */
import { generateId } from './types.js';
// ==================== 导出为 JSON Schema ====================
function fieldToJsonSchema(field) {
    const result = {};
    switch (field.type) {
        case 'string': {
            const f = field;
            result.type = 'string';
            if (f.minLength !== undefined)
                result.minLength = f.minLength;
            if (f.maxLength !== undefined)
                result.maxLength = f.maxLength;
            if (f.format && f.format !== 'none')
                result.format = f.format;
            if (f.enum && f.enum.length > 0)
                result.enum = f.enum;
            break;
        }
        case 'number': {
            const f = field;
            result.type = 'number';
            if (f.minimum !== undefined)
                result.minimum = f.minimum;
            if (f.maximum !== undefined)
                result.maximum = f.maximum;
            if (f.enum && f.enum.length > 0)
                result.enum = f.enum;
            break;
        }
        case 'boolean': {
            const f = field;
            result.type = 'boolean';
            // If only one value is allowed, use enum
            if (f.allowTrue === true && f.allowFalse === false) {
                result.enum = [true];
            }
            else if (f.allowTrue === false && f.allowFalse === true) {
                result.enum = [false];
            }
            break;
        }
        case 'array': {
            const f = field;
            result.type = 'array';
            result.items = fieldToJsonSchema(f.items);
            if (f.minItems !== undefined)
                result.minItems = f.minItems;
            if (f.maxItems !== undefined)
                result.maxItems = f.maxItems;
            if (f.uniqueItems)
                result.uniqueItems = true;
            break;
        }
        case 'object': {
            result.type = 'object';
            const properties = {};
            const required = [];
            for (const prop of field.properties) {
                properties[prop.name] = fieldToJsonSchema(prop);
                if (prop.required) {
                    required.push(prop.name);
                }
            }
            result.properties = properties;
            if (required.length > 0) {
                result.required = required;
            }
            break;
        }
    }
    if (field.description) {
        result.description = field.description;
    }
    return result;
}
/** 导出为标准 JSON Schema */
export function toJsonSchema(schema) {
    const properties = {};
    const required = [];
    for (const field of schema.properties) {
        properties[field.name] = fieldToJsonSchema(field);
        if (field.required) {
            required.push(field.name);
        }
    }
    return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        properties,
        ...(required.length > 0 ? { required } : {}),
        ...(schema.title ? { title: schema.title } : {}),
        ...(schema.description ? { description: schema.description } : {}),
    };
}
// ==================== 从 JSON Schema 解析 ====================
function jsonSchemaToField(json, name, isRequired) {
    const id = generateId();
    const description = json.description;
    const type = json.type;
    const base = {
        id,
        name,
        description: description || '',
        required: isRequired,
    };
    switch (type) {
        case 'string': {
            const enumValues = json.enum;
            return {
                ...base,
                type: 'string',
                minLength: json.minLength,
                maxLength: json.maxLength,
                format: json.format || 'none',
                enum: enumValues || [],
            };
        }
        case 'number':
        case 'integer': {
            const enumValues = json.enum;
            return {
                ...base,
                type: 'number',
                minimum: json.minimum,
                maximum: json.maximum,
                enum: enumValues || [],
            };
        }
        case 'boolean': {
            const enumValues = json.enum;
            let allowTrue = true;
            let allowFalse = true;
            if (enumValues) {
                allowTrue = enumValues.includes(true);
                allowFalse = enumValues.includes(false);
            }
            return { ...base, type: 'boolean', allowTrue, allowFalse };
        }
        case 'array': {
            const items = json.items;
            const itemField = items
                ? jsonSchemaToField(items, 'item', false)
                : { id: generateId(), name: 'item', type: 'string', description: '', required: false, format: 'none', enum: [] };
            return {
                ...base,
                type: 'array',
                items: itemField,
                minItems: json.minItems,
                maxItems: json.maxItems,
                uniqueItems: json.uniqueItems,
            };
        }
        case 'object': {
            const properties = json.properties;
            const requiredFields = json.required;
            const fields = [];
            if (properties) {
                for (const [key, value] of Object.entries(properties)) {
                    const field = jsonSchemaToField(value, key, requiredFields?.includes(key) ?? false);
                    fields.push(field);
                }
            }
            return { ...base, type: 'object', properties: fields };
        }
        default:
            return { ...base, type: 'string', format: 'none', enum: [] };
    }
}
/** 从 JSON Schema 解析 */
export function fromJsonSchema(json) {
    const properties = json.properties;
    const required = json.required;
    const fields = [];
    if (properties) {
        for (const [name, value] of Object.entries(properties)) {
            const field = jsonSchemaToField(value, name, required?.includes(name) ?? false);
            fields.push(field);
        }
    }
    return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        properties: fields,
        title: json.title,
        description: json.description,
    };
}
