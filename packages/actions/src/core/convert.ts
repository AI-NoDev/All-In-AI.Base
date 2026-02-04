import { tool } from 'ai';
import { z } from 'zod';
import type { ActionDefinition, ActionContext, ActionRegistry } from './types';

/**
 * 合并 action 的所有 schema 为单个输入 schema
 */
function mergeSchemas(action: ActionDefinition): z.ZodType {
  const schemas: z.ZodRawShape = {};
  
  if (action.schemas.querySchema) {
    const shape = (action.schemas.querySchema as z.ZodObject<any>)._def?.shape?.();
    if (shape) Object.assign(schemas, shape);
  }
  if (action.schemas.paramsSchema) {
    const shape = (action.schemas.paramsSchema as z.ZodObject<any>)._def?.shape?.();
    if (shape) Object.assign(schemas, shape);
  }
  if (action.schemas.bodySchema) {
    const shape = (action.schemas.bodySchema as z.ZodObject<any>)._def?.shape?.();
    if (shape) Object.assign(schemas, shape);
  }
  
  return Object.keys(schemas).length > 0 ? z.object(schemas) : z.object({});
}

/**
 * 将单个 Action 转换为 AI SDK Tool
 */
export function toAITool(
  action: ActionDefinition,
  context: ActionContext
) {
  const parameters = mergeSchemas(action);
  
  return tool({
    description: action.meta.description,
    parameters,
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
