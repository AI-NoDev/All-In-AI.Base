import type { ActionRegistry, ActionDefinition } from './types';

/**
 * 创建 Action 注册表
 */
export function createActionRegistry(): ActionRegistry {
  return new Map();
}

/**
 * 注册 Action 到注册表
 */
export function registerAction(
  registry: ActionRegistry,
  action: ActionDefinition
): void {
  if (registry.has(action.meta.name)) {
    throw new Error(`Action "${action.meta.name}" already registered`);
  }
  registry.set(action.meta.name, action);
}

/**
 * 批量注册 Actions
 */
export function registerActions(
  registry: ActionRegistry,
  actions: ActionDefinition[]
): void {
  for (const action of actions) {
    registerAction(registry, action);
  }
}

/**
 * 获取 Action
 */
export function getAction(
  registry: ActionRegistry,
  name: string
): ActionDefinition | undefined {
  return registry.get(name);
}

/**
 * 获取所有 Actions
 */
export function getAllActions(registry: ActionRegistry): ActionDefinition[] {
  return Array.from(registry.values());
}

/**
 * 按标签筛选 Actions
 */
export function getActionsByTag(
  registry: ActionRegistry,
  tag: string
): ActionDefinition[] {
  return getAllActions(registry).filter(
    (action) => action.meta.tags?.includes(tag)
  );
}

/**
 * 移除 Action
 */
export function unregisterAction(
  registry: ActionRegistry,
  name: string
): boolean {
  return registry.delete(name);
}

/**
 * 检查 Action 是否存在
 */
export function hasAction(registry: ActionRegistry, name: string): boolean {
  return registry.has(name);
}
