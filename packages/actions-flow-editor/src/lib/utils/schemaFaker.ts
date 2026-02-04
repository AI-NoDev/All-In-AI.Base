/**
 * JSON Schema Faker - 根据 JSON Schema 生成模拟数据
 */

import type { JsonSchemaProperty } from '../types.js';

/** 生成随机 UUID */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 生成随机字符串 */
function generateString(schema: JsonSchemaProperty): string {
  const format = schema.format as string | undefined;
  const minLength = (schema.minLength as number) ?? 1;
  const maxLength = (schema.maxLength as number) ?? 20;
  
  // 根据 format 生成特定格式
  if (format === 'uuid') {
    return generateUUID();
  }
  if (format === 'email') {
    return `user${Math.floor(Math.random() * 1000)}@example.com`;
  }
  if (format === 'uri' || format === 'url') {
    return `https://example.com/path/${Math.floor(Math.random() * 1000)}`;
  }
  if (format === 'date') {
    return new Date().toISOString().split('T')[0];
  }
  if (format === 'date-time') {
    return new Date().toISOString();
  }
  if (format === 'time') {
    return new Date().toISOString().split('T')[1].split('.')[0];
  }
  
  // 根据字段名生成有意义的值
  const description = (schema.description as string) ?? '';
  if (description.includes('名') || description.includes('name')) {
    return `测试名称${Math.floor(Math.random() * 100)}`;
  }
  if (description.includes('描述') || description.includes('description')) {
    return '这是一段测试描述文本';
  }
  
  // 生成随机字符串
  const length = Math.min(maxLength, Math.max(minLength, 8));
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/** 生成随机数字 */
function generateNumber(schema: JsonSchemaProperty): number {
  const minimum = (schema.minimum as number) ?? 0;
  const maximum = (schema.maximum as number) ?? 100;
  const isInteger = schema.type === 'integer';
  
  const value = minimum + Math.random() * (maximum - minimum);
  return isInteger ? Math.floor(value) : Math.round(value * 100) / 100;
}

/** 生成随机布尔值 */
function generateBoolean(): boolean {
  return Math.random() > 0.5;
}

/** 生成随机数组 */
function generateArray(schema: JsonSchemaProperty): unknown[] {
  const items = schema.items as JsonSchemaProperty | undefined;
  const minItems = (schema.minItems as number) ?? 1;
  const maxItems = (schema.maxItems as number) ?? 3;
  const length = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;
  
  if (!items) {
    return Array(length).fill(null).map(() => generateString({}));
  }
  
  return Array(length).fill(null).map(() => generateFromSchema(items));
}

/** 生成随机对象 */
function generateObject(schema: JsonSchemaProperty): Record<string, unknown> {
  const properties = schema.properties as Record<string, JsonSchemaProperty> | undefined;
  const required = (schema.required as string[]) ?? [];
  
  if (!properties) {
    return {};
  }
  
  const result: Record<string, unknown> = {};
  
  for (const [key, propSchema] of Object.entries(properties)) {
    // 必填字段或 50% 概率生成可选字段
    if (required.includes(key) || Math.random() > 0.5) {
      result[key] = generateFromSchema(propSchema);
    }
  }
  
  return result;
}

/** 根据 JSON Schema 生成模拟数据 */
export function generateFromSchema(schema: JsonSchemaProperty): unknown {
  // 处理 anyOf / oneOf
  const anyOf = schema.anyOf as JsonSchemaProperty[] | undefined;
  const oneOf = schema.oneOf as JsonSchemaProperty[] | undefined;
  const unionTypes = anyOf ?? oneOf;
  
  if (unionTypes && unionTypes.length > 0) {
    // 过滤掉 null 类型，选择第一个非 null 类型
    const nonNullTypes = unionTypes.filter(t => t.type !== 'null');
    if (nonNullTypes.length > 0) {
      return generateFromSchema(nonNullTypes[0]);
    }
    return null;
  }
  
  // 处理 enum
  const enumValues = schema.enum as unknown[] | undefined;
  if (enumValues && enumValues.length > 0) {
    return enumValues[Math.floor(Math.random() * enumValues.length)];
  }
  
  // 处理 const
  if (schema.const !== undefined) {
    return schema.const;
  }
  
  // 处理 default
  if (schema.default !== undefined) {
    return schema.default;
  }
  
  // 根据类型生成
  const type = schema.type as string | undefined;
  
  switch (type) {
    case 'string':
      return generateString(schema);
    case 'number':
    case 'integer':
      return generateNumber(schema);
    case 'boolean':
      return generateBoolean();
    case 'array':
      return generateArray(schema);
    case 'object':
      return generateObject(schema);
    case 'null':
      return null;
    default:
      // 如果有 properties，当作 object 处理
      if (schema.properties) {
        return generateObject(schema);
      }
      // 默认返回空字符串
      return '';
  }
}

/** 从 Action 的 inputSchema 生成完整的模拟输入数据 */
export function generateMockInput(inputSchema: {
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
}): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  // 合并所有输入 schema 的 properties
  for (const schema of [inputSchema.query, inputSchema.params, inputSchema.body]) {
    if (!schema) continue;
    
    const properties = schema.properties as Record<string, JsonSchemaProperty> | undefined;
    if (!properties) continue;
    
    const required = (schema.required as string[]) ?? [];
    
    for (const [key, propSchema] of Object.entries(properties)) {
      // 只生成必填字段，避免生成过多数据
      if (required.includes(key)) {
        result[key] = generateFromSchema(propSchema);
      }
    }
  }
  
  return result;
}

/** 从 UtilNode 的定义生成模拟输入数据 */
export function generateMockInputForUtil(inputs: Array<{
  key: string;
  type: string;
  required: boolean;
}>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const input of inputs) {
    if (!input.required) continue;
    
    // 根据类型生成
    const types = input.type.split('|');
    const primaryType = types[0].trim();
    
    switch (primaryType) {
      case 'string':
        result[input.key] = `test_${input.key}`;
        break;
      case 'number':
        result[input.key] = Math.floor(Math.random() * 100);
        break;
      case 'boolean':
        result[input.key] = true;
        break;
      case 'array':
        result[input.key] = [];
        break;
      case 'object':
        result[input.key] = {};
        break;
      default:
        result[input.key] = `test_${input.key}`;
    }
  }
  
  return result;
}
