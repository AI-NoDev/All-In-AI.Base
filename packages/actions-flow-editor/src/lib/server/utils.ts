/**
 * Actions Flow Editor - Server Utils
 * 
 * 工具函数，用于执行 Util 节点
 */

import type { UtilType } from '../types.js';

/**
 * 执行工具节点
 */
export function executeUtil(utilType: UtilType, inputs: Record<string, unknown>): unknown {
  switch (utilType) {
    // 类型转换
    case 'toString':
      return String(inputs.value ?? '');
    case 'toNumber':
      return Number(inputs.value) || 0;
    case 'toBoolean':
      return Boolean(inputs.value);
    
    // 类型检查
    case 'isType': {
      const value = inputs.value;
      const checkType = inputs.checkType as string;
      if (checkType === 'array') return Array.isArray(value);
      if (checkType === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value);
      return typeof value === checkType;
    }
    
    // 数组操作
    case 'arrayCount':
      return Array.isArray(inputs.array) ? inputs.array.length : 0;
    case 'arrayGet': {
      const arr = inputs.array as unknown[];
      const index = inputs.index as number;
      return Array.isArray(arr) ? arr[index] : undefined;
    }
    case 'arrayFirst':
      return Array.isArray(inputs.array) ? inputs.array[0] : undefined;
    case 'arrayLast':
      return Array.isArray(inputs.array) ? inputs.array[inputs.array.length - 1] : undefined;
    case 'arrayJoin': {
      const arr = inputs.array as unknown[];
      const sep = (inputs.separator as string) ?? ',';
      return Array.isArray(arr) ? arr.join(sep) : '';
    }
    
    // 算术运算
    case 'add':
      return (Number(inputs.a) || 0) + (Number(inputs.b) || 0);
    case 'subtract':
      return (Number(inputs.a) || 0) - (Number(inputs.b) || 0);
    case 'multiply':
      return (Number(inputs.a) || 0) * (Number(inputs.b) || 0);
    case 'divide': {
      const b = Number(inputs.b) || 0;
      return b !== 0 ? (Number(inputs.a) || 0) / b : 0;
    }
    case 'modulo': {
      const b = Number(inputs.b) || 0;
      return b !== 0 ? (Number(inputs.a) || 0) % b : 0;
    }
    
    // 比较运算
    case 'equal':
      return inputs.a === inputs.b;
    case 'notEqual':
      return inputs.a !== inputs.b;
    case 'greaterThan':
      return (Number(inputs.a) || 0) > (Number(inputs.b) || 0);
    case 'greaterThanOrEqual':
      return (Number(inputs.a) || 0) >= (Number(inputs.b) || 0);
    case 'lessThan':
      return (Number(inputs.a) || 0) < (Number(inputs.b) || 0);
    case 'lessThanOrEqual':
      return (Number(inputs.a) || 0) <= (Number(inputs.b) || 0);
    
    // 逻辑运算
    case 'and':
      return Boolean(inputs.a) && Boolean(inputs.b);
    case 'or':
      return Boolean(inputs.a) || Boolean(inputs.b);
    case 'not':
      return !Boolean(inputs.value);
    
    // 字符串操作
    case 'concat':
      return String(inputs.a ?? '') + String(inputs.b ?? '');
    case 'substring': {
      const str = String(inputs.str ?? '');
      const start = Number(inputs.start) || 0;
      const end = inputs.end !== undefined ? Number(inputs.end) : undefined;
      return str.substring(start, end);
    }
    case 'stringLength':
      return String(inputs.str ?? '').length;
    case 'toUpperCase':
      return String(inputs.str ?? '').toUpperCase();
    case 'toLowerCase':
      return String(inputs.str ?? '').toLowerCase();
    case 'trim':
      return String(inputs.str ?? '').trim();
    case 'split': {
      const str = String(inputs.str ?? '');
      const sep = String(inputs.separator ?? ',');
      return str.split(sep);
    }
    case 'replace': {
      const str = String(inputs.str ?? '');
      const search = String(inputs.search ?? '');
      const replacement = String(inputs.replacement ?? '');
      return str.replace(search, replacement);
    }
    case 'includes': {
      const str = String(inputs.str ?? '');
      const search = String(inputs.search ?? '');
      return str.includes(search);
    }
    
    default:
      throw new Error(`Unknown util type: ${utilType}`);
  }
}
