/**
 * Legacy converter - RootSchema ↔ JSON Schema
 * For backward compatibility with flow-editor
 */
import type { RootSchema } from './legacy-types.js';
/** 导出为标准 JSON Schema */
export declare function legacyToJsonSchema(root: RootSchema): Record<string, unknown>;
/** 从 JSON Schema 解析为 RootSchema */
export declare function legacyFromJsonSchema(json: Record<string, unknown>): RootSchema;
