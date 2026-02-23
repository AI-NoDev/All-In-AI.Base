import type { TSchema } from '@sinclair/typebox';

/**
 * TypeBox schema 已经是 JSON Schema 兼容的，直接返回
 */
export function toJSONSchema(schema: TSchema): Record<string, unknown> {
  return schema as unknown as Record<string, unknown>;
}
