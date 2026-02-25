/**
 * Actions Plugin - 注册所有 actions 路由 + 元数据查询接口
 */

import { Elysia } from "elysia";
import type { ActionDefinition } from "@qiyu-allinai/actions";
import { createMetaRoutes, createExecuteRoutes, createActionRoutes } from "./routes";
import { createLlmsRoutes } from "./llms";

// Re-export types
export type { CurrentUser, ApiResponse, ActionSummary, ActionDetail } from "./types";

// Re-export utils
export { BUSINESS_TYPE, getBusinessType, getClientIp, truncateString, schemaToJsonSchema, generateFakeData } from "./utils";

// Re-export llms
export { generateLlmsTxt, generateAllActionsLlmsTxt } from "./llms";

/**
 * Actions Plugin - 注册所有 actions 路由 + 元数据查询接口
 * @param allActions - 所有 action 定义
 * @param wsConnectionManager - WebSocket 连接管理器（可选）
 */
export const actionsPlugin = (allActions: ActionDefinition[], wsConnectionManager?: unknown) => {
  // 构建 actions Map 用于快速查找
  const actionsMap = new Map<string, ActionDefinition>();
  for (const action of allActions) {
    actionsMap.set(action.meta.name, action);
  }

  return (app: Elysia) => app
    .use(createMetaRoutes(allActions, actionsMap))
    .use(createExecuteRoutes(actionsMap, wsConnectionManager))
    .use(createActionRoutes(allActions, wsConnectionManager))
    .use(createLlmsRoutes(allActions));
};
