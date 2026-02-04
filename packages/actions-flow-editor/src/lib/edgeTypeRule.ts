/**
 * 边数据类型规则 - 用于检查连接的类型兼容性
 */

import { parseTypeUnion, type DisplayType, DISPLAY_TYPES } from './typeEngine.js';

/**
 * 类型兼容性映射
 * key: 源类型
 * value: 可以连接到的目标类型列表
 */
const TYPE_COMPATIBILITY_MAP: Record<string, string[]> = {
  // string 可以连接到 string
  string: ['string'],
  // number 可以连接到 number（integer 已在 typeEngine 中转换为 number）
  number: ['number'],
  // boolean 可以连接到 boolean
  boolean: ['boolean'],
  // object 可以连接到 object
  object: ['object'],
  // array 可以连接到 array
  array: ['array'],
  // null 可以连接到 null
  null: ['null'],
};

/**
 * 特殊兼容性规则
 * 某些类型可以隐式转换或兼容
 */
const SPECIAL_COMPATIBILITY_RULES: Array<{
  source: string;
  target: string;
  compatible: boolean;
}> = [
  // any 类型可以接受任何输入
  // 注意：any 不是显示类型，但在内部规则中使用
];

/**
 * 检查单个类型是否兼容目标类型
 * @param sourceType 源类型（单个类型，非联合）
 * @param targetType 目标类型（单个类型，非联合）
 * @returns 是否兼容
 */
function isSingleTypeCompatible(sourceType: string, targetType: string): boolean {
  // 完全相同
  if (sourceType === targetType) return true;
  
  // 目标是 any，接受任何类型
  if (targetType === 'any') return true;
  
  // 处理 array<xxx> 格式
  const sourceArrayMatch = sourceType.match(/^array<(.+)>$/);
  const targetArrayMatch = targetType.match(/^array<(.+)>$/);
  
  // 两者都是 array<xxx> 格式
  if (sourceArrayMatch && targetArrayMatch) {
    // 比较内部类型
    return isSingleTypeCompatible(sourceArrayMatch[1], targetArrayMatch[1]);
  }
  
  // 源是 array<xxx>，目标是 array
  if (sourceArrayMatch && targetType === 'array') {
    return true;
  }
  
  // 源是 array，目标是 array<xxx>（不兼容，因为源类型不够具体）
  if (sourceType === 'array' && targetArrayMatch) {
    return false;
  }
  
  // 检查特殊规则
  for (const rule of SPECIAL_COMPATIBILITY_RULES) {
    if (rule.source === sourceType && rule.target === targetType) {
      return rule.compatible;
    }
  }
  
  // 检查兼容性映射
  const compatibleTargets = TYPE_COMPATIBILITY_MAP[sourceType];
  if (compatibleTargets && compatibleTargets.includes(targetType)) {
    return true;
  }
  
  return false;
}

/**
 * 检查源类型是否兼容目标类型
 * 
 * 规则：
 * 1. 源类型的每个类型都必须能够连接到目标类型中的某个类型
 * 2. 联合类型 A|B 可以连接到 A|B|C（子集关系）
 * 3. 联合类型 A|B|C 不能连接到 A|B（超集不能连接到子集）
 * 
 * @param sourceType 源类型字符串，如 'string', 'string|number'
 * @param targetType 目标类型字符串，如 'string', 'string|number|boolean'
 * @returns 是否兼容
 */
export function isTypeCompatible(
  sourceType: string | null,
  targetType: string | null
): boolean {
  if (!sourceType || !targetType) return false;
  
  // 完全相同
  if (sourceType === targetType) return true;
  
  // 目标是 any，接受任何类型
  if (targetType === 'any') return true;
  
  // 解析联合类型
  const sourceTypes = parseTypeUnion(sourceType);
  const targetTypes = parseTypeUnion(targetType);
  
  // 源类型的每个类型都必须能够连接到目标类型中的某个类型
  for (const st of sourceTypes) {
    let hasCompatibleTarget = false;
    
    for (const tt of targetTypes) {
      if (isSingleTypeCompatible(st, tt)) {
        hasCompatibleTarget = true;
        break;
      }
    }
    
    // 如果目标包含 any，也算兼容
    if (!hasCompatibleTarget && targetTypes.includes('any')) {
      hasCompatibleTarget = true;
    }
    
    if (!hasCompatibleTarget) {
      return false;
    }
  }
  
  return true;
}

/**
 * 获取类型的兼容目标类型列表
 * @param sourceType 源类型
 * @returns 可以连接到的目标类型列表
 */
export function getCompatibleTargetTypes(sourceType: string): string[] {
  const sourceTypes = parseTypeUnion(sourceType);
  const compatibleTypes = new Set<string>();
  
  for (const st of sourceTypes) {
    const targets = TYPE_COMPATIBILITY_MAP[st];
    if (targets) {
      for (const t of targets) {
        compatibleTypes.add(t);
      }
    }
    // 自身类型总是兼容的
    compatibleTypes.add(st);
  }
  
  return [...compatibleTypes];
}

/**
 * 验证连接是否有效
 * @param sourceType 源节点输出类型
 * @param targetType 目标节点输入类型
 * @param options 额外选项
 * @returns 验证结果
 */
export function validateConnection(
  sourceType: string | null,
  targetType: string | null,
  options?: {
    /** 是否允许 null 类型 */
    allowNull?: boolean;
  }
): { valid: boolean; reason?: string } {
  if (!sourceType) {
    return { valid: false, reason: '源类型未知' };
  }
  
  if (!targetType) {
    return { valid: false, reason: '目标类型未知' };
  }
  
  // 检查 null 类型
  if (!options?.allowNull) {
    if (sourceType === 'null') {
      return { valid: false, reason: '不允许 null 类型作为源' };
    }
  }
  
  // 检查类型兼容性
  if (!isTypeCompatible(sourceType, targetType)) {
    return {
      valid: false,
      reason: `类型不兼容: ${sourceType} 无法连接到 ${targetType}`,
    };
  }
  
  return { valid: true };
}

/**
 * 获取类型的显示颜色
 * @param typeStr 类型字符串
 * @returns CSS 颜色类名 (supports dark mode via Tailwind)
 */
export function getTypeColor(typeStr: string | null): string {
  if (!typeStr) return 'text-muted-foreground';
  
  // 处理 array<xxx> 格式
  if (typeStr.startsWith('array<')) {
    return 'text-chart-3';
  }
  
  const types = parseTypeUnion(typeStr);
  
  // 单一类型
  if (types.length === 1) {
    const t = types[0];
    // 再次检查 array<xxx>（可能在联合类型解析后）
    if (t.startsWith('array<')) return 'text-chart-3';
    
    switch (t) {
      case 'string': return 'text-chart-2';
      case 'number': return 'text-primary';
      case 'boolean': return 'text-chart-5';
      case 'object': return 'text-chart-4';
      case 'array': return 'text-chart-3';
      case 'null': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  }
  
  // 联合类型
  return 'text-chart-4';
}

/**
 * 获取类型的 Handle 颜色
 * @param typeStr 类型字符串
 * @returns CSS 背景颜色 (使用 CSS 变量以支持主题切换)
 */
export function getHandleColor(typeStr: string | null): string {
  if (!typeStr) return 'hsl(var(--muted-foreground))';
  
  // 处理 array<xxx> 格式
  if (typeStr.startsWith('array<')) {
    return 'hsl(var(--chart-3))';
  }
  
  const types = parseTypeUnion(typeStr);
  
  // 单一类型
  if (types.length === 1) {
    const t = types[0];
    // 再次检查 array<xxx>（可能在联合类型解析后）
    if (t.startsWith('array<')) return 'hsl(var(--chart-3))';
    
    switch (t) {
      case 'string': return 'hsl(var(--chart-2))';
      case 'number': return 'hsl(var(--primary))';
      case 'boolean': return 'hsl(var(--chart-5))';
      case 'object': return 'hsl(var(--chart-4))';
      case 'array': return 'hsl(var(--chart-3))';
      case 'null': return 'hsl(var(--muted-foreground))';
      default: return 'hsl(var(--muted-foreground))';
    }
  }
  
  // 联合类型
  return 'hsl(var(--chart-4))';
}
