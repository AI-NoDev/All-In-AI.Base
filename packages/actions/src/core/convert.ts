import { tool, jsonSchema } from 'ai';
import { z } from 'zod/v4';
import type { ActionDefinition, ActionContext, ActionRegistry } from './types';

/** 空 JSON Schema 对象 */
const emptyJsonSchema = jsonSchema<Record<string, never>>({
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false,
});

/** 合并 action 的所有 schema 为单个输入 schema，并转换为 JSON Schema */
function mergeActionSchemas(action: ActionDefinition) {
  const shape: Record<string, z.ZodType> = {};
  
  if (action.schemas.querySchema) {
    shape.query = action.schemas.querySchema as z.ZodType;
  }
  if (action.schemas.paramsSchema) {
    shape.params = action.schemas.paramsSchema as z.ZodType;
  }
  if (action.schemas.bodySchema) {
    shape.body = action.schemas.bodySchema as z.ZodType;
  }
  
  // 如果没有任何 schema，返回空 JSON Schema
  if (Object.keys(shape).length === 0) {
    return emptyJsonSchema;
  }
  
  // 构建合并后的 Zod schema 并转换为 JSON Schema
  const mergedSchema = z.object(shape);
  const jsonSchemaObj = z.toJSONSchema(mergedSchema) as Record<string, unknown>;
  
  return jsonSchema<Record<string, unknown>>(jsonSchemaObj);
}

/**
 * 将单个 Action 转换为 AI SDK Tool
 */
export function toAITool(
  action: ActionDefinition,
  context: ActionContext
) {
  const inputSchema = mergeActionSchemas(action);
  
  return tool({
    description: action.meta.description,
    inputSchema,
    execute: async (input) => {
      return action.execute(input, context);
    },
  });
}

/**
 * 将多个 Actions 转换为 AI SDK Tools 对象
 */
export function toAITools(
  actions: ActionDefinition[],
  context: ActionContext
) {
  const tools: Record<string, ReturnType<typeof toAITool>> = {};
  
  for (const action of actions) {
    tools[action.meta.name] = toAITool(action, context);
  }
  
  return tools;
}

/**
 * 从注册表中获取 Action 并转换为 AI SDK Tool
 */
export function actionToTool(
  registry: ActionRegistry,
  actionName: string,
  context: ActionContext
) {
  const action = registry.get(actionName);
  if (!action) {
    return undefined;
  }
  return toAITool(action, context);
}

/**
 * 从注册表中获取所有 Actions 并转换为 AI SDK Tools
 */
export function actionsToTools(
  registry: ActionRegistry,
  context: ActionContext
) {
  const tools: Record<string, ReturnType<typeof toAITool>> = {};
  
  for (const [name, action] of registry) {
    tools[name] = toAITool(action, context);
  }
  
  return tools;
}
