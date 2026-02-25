/**
 * 转换器 - 内部格式与 JSON Schema 互转
 */

import type { Field, JsonSchema, StringField, NumberField, BooleanField, ArrayField, StringFormat } from './types.js';
import { generateId } from './types.js';

// ==================== 导出为 JSON Schema ====================

function fieldToJsonSchema(field: Field): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  switch (field.type) {
    case 'string': {
      const f = field as StringField;
      result.type = 'string';
      if (f.minLength !== undefined) result.minLength = f.minLength;
      if (f.maxLength !== undefined) result.maxLength = f.maxLength;
      if (f.format && f.format !== 'none') result.format = f.format;
      if (f.enum && f.enum.length > 0) result.enum = f.enum;
      break;
    }
    case 'number': {
      const f = field as NumberField;
      result.type = 'number';
      if (f.minimum !== undefined) result.minimum = f.minimum;
      if (f.maximum !== undefined) result.maximum = f.maximum;
      if (f.enum && f.enum.length > 0) result.enum = f.enum;
      break;
    }
    case 'boolean': {
      const f = field as BooleanField;
      result.type = 'boolean';
      // If only one value is allowed, use enum
      if (f.allowTrue === true && f.allowFalse === false) {
        result.enum = [true];
      } else if (f.allowTrue === false && f.allowFalse === true) {
        result.enum = [false];
      }
      break;
    }
    case 'array': {
      const f = field as ArrayField;
      result.type = 'array';
      result.items = fieldToJsonSchema(f.items);
      if (f.minItems !== undefined) result.minItems = f.minItems;
      if (f.maxItems !== undefined) result.maxItems = f.maxItems;
      if (f.uniqueItems) result.uniqueItems = true;
      break;
    }
    case 'object': {
      result.type = 'object';
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
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
export function toJsonSchema(schema: JsonSchema): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

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

function jsonSchemaToField(json: Record<string, unknown>, name: string, isRequired: boolean): Field {
  const id = generateId();
  const description = json.description as string | undefined;
  const type = json.type as string;

  const base = {
    id,
    name,
    description: description || '',
    required: isRequired,
  };

  switch (type) {
    case 'string': {
      const enumValues = json.enum as string[] | undefined;
      return {
        ...base,
        type: 'string',
        minLength: json.minLength as number | undefined,
        maxLength: json.maxLength as number | undefined,
        format: (json.format as StringFormat) || 'none',
        enum: enumValues || [],
      };
    }
    case 'number':
    case 'integer': {
      const enumValues = json.enum as number[] | undefined;
      return {
        ...base,
        type: 'number',
        minimum: json.minimum as number | undefined,
        maximum: json.maximum as number | undefined,
        enum: enumValues || [],
      };
    }
    case 'boolean': {
      const enumValues = json.enum as boolean[] | undefined;
      let allowTrue = true;
      let allowFalse = true;
      if (enumValues) {
        allowTrue = enumValues.includes(true);
        allowFalse = enumValues.includes(false);
      }
      return { ...base, type: 'boolean', allowTrue, allowFalse };
    }
    case 'array': {
      const items = json.items as Record<string, unknown> | undefined;
      const itemField = items
        ? jsonSchemaToField(items, 'item', false)
        : { id: generateId(), name: 'item', type: 'string' as const, description: '', required: false, format: 'none' as StringFormat, enum: [] };
      return {
        ...base,
        type: 'array',
        items: itemField,
        minItems: json.minItems as number | undefined,
        maxItems: json.maxItems as number | undefined,
        uniqueItems: json.uniqueItems as boolean | undefined,
      };
    }
    case 'object': {
      const properties = json.properties as Record<string, Record<string, unknown>> | undefined;
      const requiredFields = json.required as string[] | undefined;
      const fields: Field[] = [];
      if (properties) {
        for (const [key, value] of Object.entries(properties)) {
          const field = jsonSchemaToField(value, key, requiredFields?.includes(key) ?? false);
          fields.push(field);
        }
      }
      return { ...base, type: 'object', properties: fields };
    }
    default:
      return { ...base, type: 'string', format: 'none' as StringFormat, enum: [] };
  }
}

/** 从 JSON Schema 解析 */
export function fromJsonSchema(json: Record<string, unknown>): JsonSchema {
  const properties = json.properties as Record<string, Record<string, unknown>> | undefined;
  const required = json.required as string[] | undefined;
  const fields: Field[] = [];

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
    title: json.title as string | undefined,
    description: json.description as string | undefined,
  };
}
