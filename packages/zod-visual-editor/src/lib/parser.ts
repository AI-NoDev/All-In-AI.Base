/**
 * 解析器 - 将 Zod Schema / JSON Schema 转换为简化数据结构
 */

import { z } from 'zod';
import type { SchemaType, Field, RootSchema } from './types.js';
import { generateId } from './types.js';

// ==================== Zod Schema 解析 ====================

interface ZodDef {
  typeName?: string;
  innerType?: z.ZodTypeAny;
  type?: z.ZodTypeAny;
  value?: string | number | boolean;
  values?: readonly (string | number)[];
  shape?: Record<string, z.ZodTypeAny>;
  options?: z.ZodTypeAny[];
}

function getZodDef(schema: z.ZodTypeAny): ZodDef | undefined {
  const s = schema as unknown as { _zod?: { def?: ZodDef }; _def?: ZodDef };
  return s._zod?.def ?? s._def;
}

function zodToSchemaType(schema: z.ZodTypeAny): SchemaType {
  const def = getZodDef(schema);
  if (!def) return { id: generateId(), type: 'string' };

  const typeName = def.typeName;

  // Handle wrappers
  if (typeName === 'ZodOptional' && def.innerType) {
    const inner = zodToSchemaType(def.innerType);
    return { ...inner, optional: true };
  }
  if (typeName === 'ZodNullable' && def.innerType) {
    // Treat nullable as optional since we removed nullable support
    const inner = zodToSchemaType(def.innerType);
    return { ...inner, optional: true };
  }

  switch (typeName) {
    case 'ZodString':
      return { id: generateId(), type: 'string' };
    case 'ZodNumber':
      return { id: generateId(), type: 'number' };
    case 'ZodBoolean':
      return { id: generateId(), type: 'boolean' };
    case 'ZodLiteral':
      return { id: generateId(), type: 'literal', value: def.value as string | number | boolean };
    case 'ZodEnum':
      return { id: generateId(), type: 'enum', values: [...(def.values || [])] as (string | number)[] };
    case 'ZodArray': {
      const item = def.type ? zodToSchemaType(def.type) : { id: generateId(), type: 'string' as const };
      return { id: generateId(), type: 'array', item };
    }
    case 'ZodUnion': {
      const options = (def.options || []).map(zodToSchemaType);
      return { id: generateId(), type: 'union', options: options.length > 0 ? options : [{ id: generateId(), type: 'string' }] };
    }
    case 'ZodObject': {
      const fields: Field[] = [];
      if (def.shape) {
        for (const [name, value] of Object.entries(def.shape)) {
          const schemaType = zodToSchemaType(value);
          fields.push({ ...schemaType, name } as Field);
        }
      }
      return { id: generateId(), type: 'object', fields };
    }
    default:
      return { id: generateId(), type: 'string' };
  }
}

/** 从 Zod Schema 解析为 RootSchema */
export function fromZodSchema(schema: z.ZodObject<z.ZodRawShape>): RootSchema {
  const result = zodToSchemaType(schema);
  if (result.type === 'object') {
    return { type: 'object', id: 'root', fields: result.fields };
  }
  return { type: 'object', id: 'root', fields: [] };
}

// ==================== JSON Schema 解析 ====================

function jsonSchemaToSchemaType(json: Record<string, unknown>, name?: string): SchemaType | Field {
  const id = generateId();
  const description = json.description as string | undefined;
  const type = json.type as string | string[];
  const nullable = Array.isArray(type) && type.includes('null');
  const actualType = Array.isArray(type) ? type.find(t => t !== 'null') : type;

  let result: SchemaType;

  if (json.const !== undefined) {
    result = { id, type: 'literal', value: json.const as string | number | boolean };
  } else if (json.enum) {
    result = { id, type: 'enum', values: json.enum as (string | number)[] };
  } else if (json.oneOf || json.anyOf) {
    const options = ((json.oneOf || json.anyOf) as Record<string, unknown>[]).map(o => jsonSchemaToSchemaType(o) as SchemaType);
    result = { id, type: 'union', options };
  } else if (actualType === 'string') {
    result = { id, type: 'string' };
  } else if (actualType === 'number' || actualType === 'integer') {
    result = { id, type: 'number' };
  } else if (actualType === 'boolean') {
    result = { id, type: 'boolean' };
  } else if (actualType === 'array') {
    const items = json.items as Record<string, unknown> | undefined;
    const item = items ? jsonSchemaToSchemaType(items) as SchemaType : { id: generateId(), type: 'string' as const };
    result = { id, type: 'array', item };
  } else if (actualType === 'object') {
    const properties = json.properties as Record<string, Record<string, unknown>> | undefined;
    const required = json.required as string[] | undefined;
    const fields: Field[] = [];
    if (properties) {
      for (const [key, value] of Object.entries(properties)) {
        const field = jsonSchemaToSchemaType(value, key) as Field;
        field.optional = !required?.includes(key);
        fields.push(field);
      }
    }
    result = { id, type: 'object', fields };
  } else {
    result = { id, type: 'string' };
  }

  if (description) result.description = description;
  // Treat nullable as optional since we removed nullable support
  if (nullable) result.optional = true;

  if (name !== undefined) {
    return { ...result, name } as Field;
  }
  return result;
}

/** 从 JSON Schema 解析为 RootSchema */
export function fromJsonSchema(json: Record<string, unknown>): RootSchema {
  const properties = json.properties as Record<string, Record<string, unknown>> | undefined;
  const required = json.required as string[] | undefined;
  const fields: Field[] = [];

  if (properties) {
    for (const [name, value] of Object.entries(properties)) {
      const field = jsonSchemaToSchemaType(value, name) as Field;
      field.optional = !required?.includes(name);
      fields.push(field);
    }
  }

  return { type: 'object', id: 'root', fields };
}
