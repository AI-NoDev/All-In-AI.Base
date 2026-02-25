/**
 * 转换器 - 内部格式与 JSON Schema 互转
 */
import type { JsonSchema } from './types.js';
/** 导出为标准 JSON Schema */
export declare function toJsonSchema(schema: JsonSchema): Record<string, unknown>;
/** 从 JSON Schema 解析 */
export declare function fromJsonSchema(json: Record<string, unknown>): JsonSchema;
