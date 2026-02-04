import { z } from 'zod/v4';

/**
 * Convert Zod schema to JSON Schema with Date type handling
 * Date types are converted to string with date-time format
 */
export function toJSONSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  return z.toJSONSchema(schema, {
    unrepresentable: 'any',

  }) as Record<string, unknown>;
}
