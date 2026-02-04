/**
 * 类型引擎 - 用于解析 JSON Schema 并转换为显示类型
 * 
 * 显示类型只能是以下基础类型或其联合：
 * - object
 * - array
 * - boolean
 * - string
 * - number
 * - null
 */

/** 基础显示类型 */
export type DisplayType = 'object' | 'array' | 'boolean' | 'string' | 'number' | 'null';

/** 所有支持的显示类型 */
export const DISPLAY_TYPES: DisplayType[] = ['object', 'array', 'boolean', 'string', 'number', 'null'];

/** JSON Schema 属性接口 */
export interface SchemaProperty {
  type?: string;
  enum?: unknown[];
  const?: unknown;
  anyOf?: SchemaProperty[];
  oneOf?: SchemaProperty[];
  allOf?: SchemaProperty[];
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  [key: string]: unknown;
}

/**
 * 检查是否为空对象
 */
function isEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * 将原始类型标准化为显示类型
 * - integer -> number
 * - 其他非标准类型 -> 保持原样（后续会被过滤）
 */
function normalizeType(rawType: string): string {
  if (rawType === 'integer') return 'number';
  return rawType;
}

/**
 * 判断枚举值的类型
 * @returns 'string' | 'number' | 'boolean' | 'string|number' 等
 */
function getEnumType(enumValues: unknown[]): string {
  const types = new Set<string>();
  
  for (const val of enumValues) {
    if (typeof val === 'string') {
      types.add('string');
    } else if (typeof val === 'number') {
      types.add('number');
    } else if (typeof val === 'boolean') {
      types.add('boolean');
    } else if (val === null) {
      types.add('null');
    }
  }
  
  if (types.size === 0) return 'string'; // 默认
  if (types.size === 1) return [...types][0];
  
  // 多种类型，返回联合类型
  return [...types].sort().join('|');
}

/**
 * 判断 const 值的类型
 */
function getConstType(constValue: unknown): string {
  if (typeof constValue === 'string') return 'string';
  if (typeof constValue === 'number') return 'number';
  if (typeof constValue === 'boolean') return 'boolean';
  if (constValue === null) return 'null';
  if (Array.isArray(constValue)) return 'array';
  if (typeof constValue === 'object') return 'object';
  return 'string';
}

/**
 * 从 JSON Schema 属性解析原始类型字符串
 * 返回内部使用的类型表示（可能包含 xxx[] 形式）
 */
function parseRawType(prop: SchemaProperty): string | null {
  if (isEmptyObject(prop as Record<string, unknown>)) return null;
  
  // 处理 const
  if (prop.const !== undefined) {
    return getConstType(prop.const);
  }
  
  // 处理 enum
  if (prop.enum && Array.isArray(prop.enum)) {
    return getEnumType(prop.enum);
  }
  
  // 处理 anyOf / oneOf
  const unionTypes = prop.anyOf ?? prop.oneOf;
  if (unionTypes && Array.isArray(unionTypes)) {
    const types: string[] = [];
    for (const item of unionTypes) {
      if (isEmptyObject(item as Record<string, unknown>)) continue;
      const itemType = parseRawType(item);
      if (itemType === null) continue;
      // 拆分联合类型并添加
      for (const t of itemType.split('|')) {
        if (t && !types.includes(t)) {
          types.push(t);
        }
      }
    }
    if (types.length === 0) return null;
    return types.join('|');
  }
  
  // 处理 allOf（取交集，简化处理为取第一个有效类型）
  if (prop.allOf && Array.isArray(prop.allOf)) {
    for (const item of prop.allOf) {
      const itemType = parseRawType(item);
      if (itemType) return itemType;
    }
    return null;
  }
  
  // 处理 array
  if (prop.type === 'array') {
    if (prop.items) {
      const itemType = parseRawType(prop.items);
      if (itemType === null) return 'array<unknown>';
      return `array<${itemType}>`;
    }
    return 'array<unknown>';
  }
  
  // 处理基本类型
  if (prop.type) {
    const rawType = Array.isArray(prop.type) ? prop.type[0] : prop.type;
    return normalizeType(rawType as string);
  }
  
  return null;
}

/**
 * 将原始类型转换为显示类型
 * 过滤掉非标准类型，只保留 DisplayType
 */
function toDisplayType(rawType: string): string {
  // 处理 array<xxx> 格式
  const arrayMatch = rawType.match(/^array<(.+)>$/);
  if (arrayMatch) {
    const itemType = toDisplayType(arrayMatch[1]);
    return `array<${itemType}>`;
  }
  
  const types = rawType.split('|');
  const displayTypes: string[] = [];
  
  for (const t of types) {
    // 处理 array<xxx> 在联合类型中的情况
    const arrMatch = t.match(/^array<(.+)>$/);
    if (arrMatch) {
      const itemType = toDisplayType(arrMatch[1]);
      if (!displayTypes.includes(`array<${itemType}>`)) {
        displayTypes.push(`array<${itemType}>`);
      }
      continue;
    }
    
    const normalized = normalizeType(t);
    // 只保留有效的显示类型
    if (DISPLAY_TYPES.includes(normalized as DisplayType)) {
      if (!displayTypes.includes(normalized)) {
        displayTypes.push(normalized);
      }
    }
  }
  
  if (displayTypes.length === 0) return 'object'; // 默认
  if (displayTypes.length === 1) return displayTypes[0];
  
  // 排序以保证一致性
  return displayTypes.sort().join('|');
}

/**
 * 从 JSON Schema 属性获取显示类型
 * @param prop JSON Schema 属性
 * @returns 显示类型字符串，如 'string', 'number', 'string|number', 'array', 'object'
 */
export function getDisplayType(prop: SchemaProperty): string {
  const rawType = parseRawType(prop);
  if (!rawType) return 'object';
  return toDisplayType(rawType);
}

/**
 * 从 JSON Schema 获取指定属性的显示类型
 * @param schema JSON Schema 对象
 * @param key 属性名
 * @returns 显示类型字符串，如果找不到返回 null
 */
export function getSchemaPropertyDisplayType(
  schema: Record<string, unknown> | undefined,
  key: string
): string | null {
  if (!schema) return null;
  
  let properties: Record<string, SchemaProperty> | undefined;
  
  // 直接从 properties 获取
  if (schema.properties) {
    properties = schema.properties as Record<string, SchemaProperty>;
  }
  
  // 从 anyOf/oneOf 中查找 object 类型的 properties
  if (!properties) {
    const unionTypes = (schema.anyOf ?? schema.oneOf) as SchemaProperty[] | undefined;
    if (unionTypes) {
      for (const item of unionTypes) {
        if (item.type === 'object' && item.properties) {
          properties = item.properties as Record<string, SchemaProperty>;
          break;
        }
      }
    }
  }
  
  if (!properties || !properties[key]) return null;
  return getDisplayType(properties[key]);
}

/**
 * 解析类型字符串为类型数组
 * @param typeStr 类型字符串，如 'string|number'
 * @returns 类型数组，如 ['string', 'number']
 */
export function parseTypeUnion(typeStr: string): string[] {
  return typeStr.split('|').filter(Boolean);
}

/**
 * 格式化类型用于显示
 * @param typeStr 类型字符串
 * @returns 格式化后的显示字符串
 */
export function formatTypeForDisplay(typeStr: string | null): string {
  if (!typeStr) return 'unknown';
  return typeStr;
}

/**
 * 获取数组项的 Schema
 * @param prop JSON Schema 属性
 * @returns 数组项的 Schema，如果不是数组则返回 null
 */
export function getArrayItemSchema(prop: SchemaProperty): SchemaProperty | null {
  if (prop.type === 'array' && prop.items) {
    return prop.items;
  }
  return null;
}

/**
 * 解析 array<xxx> 格式，提取内部类型
 * @param typeStr 类型字符串，如 'array<string>' 或 'array<object>'
 * @returns 内部类型字符串，如 'string' 或 'object'，如果不是 array 格式返回 null
 */
export function parseArrayType(typeStr: string): string | null {
  const match = typeStr.match(/^array<(.+)>$/);
  return match ? match[1] : null;
}

/**
 * 检查类型是否为 array 类型（包括 array<xxx> 格式）
 */
export function isArrayType(typeStr: string): boolean {
  return typeStr === 'array' || typeStr.startsWith('array<');
}

/**
 * 检查类型是否为 object 类型
 */
export function isObjectType(typeStr: string): boolean {
  return typeStr === 'object';
}
