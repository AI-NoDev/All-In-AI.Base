/**
 * Actions Plugin - 路由定义
 */

import { Elysia, t } from "elysia";
import { Box } from "@sinclair/typebox-adapter";
import type { ActionDefinition } from "@qiyu-allinai/actions";
import type { ActionSummary, ActionDetail } from "./types";
import { schemaToJsonSchema } from "./utils";
import { createExecuteHandler, createActionHandler } from "./handlers";

/**
 * 创建 actions 元数据路由
 */
export function createMetaRoutes(
  allActions: ActionDefinition[],
  actionsMap: Map<string, ActionDefinition>
): Elysia {
  return new Elysia({ name: "actions-meta-routes" })
    // GET /api/actions - 获取所有 actions 列表
    .get(
      "/api/actions",
      () => {
        const filteredActions = allActions.filter((action) => {
          if (action.meta.ignoreTools) return false;
          if (action.meta.path.endsWith('/schema')) return false;
          return true;
        });
        
        const list: ActionSummary[] = filteredActions.map((action) => ({
          name: action.meta.name,
          displayName: action.meta.displayName,
          description: action.meta.description,
          tags: action.meta.tags ?? [],
          method: action.meta.method,
          path: action.meta.path,
        }));
        return { data: list, status: 200, message: "ok" };
      },
      {
        detail: {
          summary: "获取所有Actions列表",
          description: "获取系统中所有已注册的Actions的名称和描述",
          tags: ["actions"],
        },
        response: {
          200: t.Object({
            data: t.Array(t.Object({
              name: t.String(),
              displayName: t.String(),
              description: t.String(),
              tags: t.Array(t.String()),
              method: t.String(),
              path: t.String(),
            })),
            status: t.Number({ default: 200 }),
            message: t.String({ default: "ok" }),
          }),
        },
      }
    )
    // GET /api/actions/:name - 获取单个 action 详情
    .get(
      "/api/actions/:name",
      ({ params, set }) => {
        const action = actionsMap.get(params.name);
        if (!action) {
          set.status = 404;
          return { data: null, status: 404, message: "Action not found" };
        }

        const detail: ActionDetail = {
          name: action.meta.name,
          displayName: action.meta.displayName,
          description: action.meta.description,
          tags: action.meta.tags ?? [],
          method: action.meta.method,
          path: action.meta.path,
          inputSchema: {
            query: schemaToJsonSchema(action.schemas.querySchema),
            params: schemaToJsonSchema(action.schemas.paramsSchema),
            body: schemaToJsonSchema(action.schemas.bodySchema),
          },
          outputSchema: schemaToJsonSchema(action.schemas.outputSchema) ?? {},
        };
        return { data: detail, status: 200, message: "ok" };
      },
      {
        detail: {
          summary: "获取Action详情",
          description: "根据Action名称获取详细信息，包含输入输出的JSON Schema",
          tags: ["actions"],
        },
        params: t.Object({ name: t.String() }),
        response: {
          200: t.Object({
            data: t.Any(),
            status: t.Number({ default: 200 }),
            message: t.String({ default: "ok" }),
          }),
        },
      }
    );
}

/**
 * 创建 execute 路由
 */
export function createExecuteRoutes(
  actionsMap: Map<string, ActionDefinition>,
  wsConnectionManager?: unknown
): Elysia {
  const executeHandler = createExecuteHandler(actionsMap, wsConnectionManager);
  const app = new Elysia({ name: "actions-execute-routes" });
  
  (app.post as Function)(
    "/api/actions/execute/:name",
    executeHandler,
    {
      detail: {
        summary: "通过名称执行Action",
        description: "通过Action名称执行，支持X-Sandbox header控制沙盒模式",
        tags: ["actions"],
      },
      params: t.Object({ name: t.String() }),
      body: t.Any(),
      response: {
        200: t.Object({
          data: t.Any(),
          status: t.Number({ default: 200 }),
          message: t.String({ default: "ok" }),
        }),
      },
    }
  );
  
  return app;
}

/**
 * 创建所有 action 的 API 路由
 */
export function createActionRoutes(
  allActions: ActionDefinition[],
  wsConnectionManager?: unknown
): Elysia {
  const app = new Elysia({ name: "actions-api-routes" });

  for (const action of allActions) {
    const handler = createActionHandler(action, wsConnectionManager);
    const options = {
      detail: {
        summary: action.meta.displayName,
        description: action.meta.description,
        tags: action.meta.tags,
      },
      query: action.schemas.querySchema,
      body: action.schemas.bodySchema,
      params: action.schemas.paramsSchema,
      response: {
        200: t.Object({
          data: Box(action.schemas.outputSchema),
          status: t.Number({ default: 200 }),
          message: t.String({ default: "ok" }),
        }),
      },
    };

    switch (action.meta.method) {
      case "GET":
        (app.get as Function)(action.meta.path, handler, options);
        break;
      case "POST":
        (app.post as Function)(action.meta.path, handler, options);
        break;
      case "PUT":
        (app.put as Function)(action.meta.path, handler, options);
        break;
      case "DELETE":
        (app.delete as Function)(action.meta.path, handler, options);
        break;
    }
  }

  return app;
}
