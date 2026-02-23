import type { ActionDefinition } from "@qiyu-allinai/actions";
import type { TSchema } from "@sinclair/typebox";

/** TypeBox schema shape for MCP tool input */
export type TypeBoxSchemaShape = Record<string, TSchema>;

/**
 * Build input schema shape for MCP tool
 */
export function buildInputSchemaShape(action: ActionDefinition): TypeBoxSchemaShape {
  const shape: TypeBoxSchemaShape = {};
  if (action.schemas.paramsSchema) {
    shape.params = action.schemas.paramsSchema;
  }
  if (action.schemas.querySchema) {
    shape.query = action.schemas.querySchema;
  }
  if (action.schemas.bodySchema) {
    shape.body = action.schemas.bodySchema;
  }
  return shape;
}

/**
 * Flatten MCP tool arguments to action input format
 * MCP tools receive { params, body, query }, actions expect flat input
 */
export function flattenMcpArgs(args: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  // Spread params (URL path parameters like :id)
  if (args.params && typeof args.params === 'object') {
    Object.assign(result, args.params);
  }
  
  // Spread query (URL query parameters)
  if (args.query && typeof args.query === 'object') {
    Object.assign(result, args.query);
  }
  
  // Spread body (request body)
  if (args.body && typeof args.body === 'object') {
    Object.assign(result, args.body);
  }
  
  return result;
}
