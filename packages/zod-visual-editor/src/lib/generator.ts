/**
 * 生成器 - 将简化数据结构转换为 Zod Schema / JSON Schema / TypeScript
 */

import { z } from 'zod';
import type { SchemaType, Field, RootSchema } from './types.js';

// ==================== Zod Schema 生成 ====================

function schemaTypeToZod(schema: SchemaType): z.ZodTypeAny {
  let zSchema: z.ZodTypeAny;

  switch (schema.type) {
    case 'string':
      zSchema = z.string();
      break;
    case 'number':
      zSchema = z.number();
      break;
    case 'boolean':
      zSchema = z.boolean();
      break;
    case 'literal':
      zSchema = z.literal(schema.value);
      break;
    case 'enum':
      if (schema.values.length > 0) {
        const vals = schema.values.map(String) as [string, ...string[]];
        zSchema = z.enum(vals);
      } else {
        zSchema = z.string();
      }
      break;
    case 'array':
      zSchema = z.array(schemaTypeToZod(schema.item));
      break;
    case 'union':
      if (schema.options.length >= 2) {
        const [first, second, ...rest] = schema.options.map(schemaTypeToZod);
        zSchema = z.union([first, second, ...rest]);
      } else if (schema.options.length === 1) {
        zSchema = schemaTypeToZod(schema.options[0]);
      } else {
        zSchema = z.unknown();
      }
      break;
    case 'object': {
      const shape: Record<string, z.ZodTypeAny> = {};
      for (const field of schema.fields) {
        shape[field.name] = fieldToZod(field);
      }
      zSchema = z.object(shape);
      break;
    }
    default:
      zSchema = z.unknown();
  }

  if (schema.description) {
    zSchema = zSchema.describe(schema.description);
  }
  if (schema.optional) {
    zSchema = zSchema.optional();
  }

  return zSchema;
}

function fieldToZod(field: Field): z.ZodTypeAny {
  return schemaTypeToZod(field);
}

/** 生成 Zod Schema 对象 */
export function toZodSchema(root: RootSchema): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of root.fields) {
    shape[field.name] = fieldToZod(field);
  }
  return z.object(shape);
}

// ==================== JSON Schema 生成 ====================

function schemaTypeToJsonSchema(schema: SchemaType): Record<string, unknown> {
  const result: Record<string, unknown> = {};

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
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
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

/** 生成 JSON Schema */
export function toJsonSchema(root: RootSchema): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

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

// ==================== TypeScript 代码生成 ====================

function schemaTypeToCode(schema: SchemaType, indent: number = 0): string {
  const pad = '  '.repeat(indent);

  switch (schema.type) {
    case 'string':
      return 'z.string()';
    case 'number':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'literal':
      return typeof schema.value === 'string'
        ? `z.literal("${schema.value}")`
        : `z.literal(${schema.value})`;
    case 'enum':
      if (schema.values.length > 0) {
        const vals = schema.values.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ');
        return `z.enum([${vals}])`;
      }
      return 'z.string()';
    case 'array':
      return `z.array(${schemaTypeToCode(schema.item, indent)})`;
    case 'union':
      if (schema.options.length >= 2) {
        const opts = schema.options.map(o => schemaTypeToCode(o, indent)).join(', ');
        return `z.union([${opts}])`;
      }
      return schema.options.length === 1 ? schemaTypeToCode(schema.options[0], indent) : 'z.unknown()';
    case 'object':
      if (schema.fields.length === 0) {
        return 'z.object({})';
      }
      const fieldCodes = schema.fields.map(f => {
        let code = schemaTypeToCode(f, indent + 1);
        if (f.description) code += `.describe("${f.description}")`;
        if (f.optional) code += '.optional()';
        return `${pad}  ${f.name}: ${code}`;
      });
      return `z.object({\n${fieldCodes.join(',\n')}\n${pad}})`;
    default:
      return 'z.unknown()';
  }
}

/** 生成 TypeScript 代码 */
export function toTypeScriptCode(root: RootSchema): string {
  const lines: string[] = ['import { z } from "zod";', ''];

  if (root.fields.length === 0) {
    lines.push('export const schema = z.object({});');
  } else {
    lines.push('export const schema = z.object({');
    for (const field of root.fields) {
      let code = schemaTypeToCode(field, 1);
      if (field.description) code += `.describe("${field.description}")`;
      if (field.optional) code += '.optional()';
      lines.push(`  ${field.name}: ${code},`);
    }
    lines.push('});');
  }

  lines.push('', 'export type Schema = z.infer<typeof schema>;');
  return lines.join('\n');
}
