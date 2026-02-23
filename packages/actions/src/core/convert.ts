import { tool, jsonSchema } from 'ai';
import { t, type TSchema } from 'elysia';
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
  const properties: Record<string, TSchema> = {};
  
  if (action.schemas.querySchema) {
    properties.query = action.schemas.querySchema;
  }
  if (action.schemas.paramsSchema) {
    properties.params = action.schemas.paramsSchema;
  }
  if (action.schemas.bodySchema) {
    properties.body = action.schemas.bodySchema;
  }
  
  // 如果没有任何 schema，返回空 JSON Schema
  if (Object.keys(properties).length === 0) {
    return emptyJsonSchema;
  }
  
  // 构建合并后的 TypeBox schema（已经是 JSON Schema 兼容格式）
  const mergedSchema = t.Object(properties);
  
  return jsonSchema<Record<string, unknown>>(mergedSchema as unknown as Record<string, unknown>);
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
