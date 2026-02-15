import { Elysia, t } from "elysia";
import { Box } from "@sinclair/typebox-adapter";
import { toJSONSchema } from "@qiyu-allinai/actions";
import db from "@qiyu-allinai/db/connect";
import { user, operationLog } from "@qiyu-allinai/db/entities/system";
import { eq } from "drizzle-orm";
import type { ActionDefinition } from "@qiyu-allinai/actions";
import { setFaker, fake } from "zod-schema-faker/v4";
import { faker } from "@faker-js/faker";
import type { $ZodType } from "zod/v4/core";

// 配置 faker (使用类型断言解决版本不兼容问题)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
setFaker(faker as any);

// 生成 Zod Schema 的模拟数据
function generateFakeData(schema: $ZodType): unknown {
  try {
    return fake(schema);
  } catch {
    return null;
  }
}

// ============ Types ============
interface CurrentUser {
  id: string;
  name: string | null;
  loginName: string;
}

interface ApiResponse<T = unknown> {
  data: T | null;
  status: number;
  message: string;
}

interface ActionSummary {
  name: string;
  displayName: string;
  description: string;
  tags: string[];
  method: string;
  path: string;
}

interface ActionDetail extends ActionSummary {
  inputSchema: {
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  };
  outputSchema: Record<string, unknown>;
}

// ============ Business Type Constants ============
const BUSINESS_TYPE = {
  OTHER: 0,
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
  AUTHORIZE: 4,
  EXPORT: 5,
  IMPORT: 6,
} as const;

function getBusinessType(actionName: string): number {
  if (actionName.includes("create") || actionName.includes("Create")) return BUSINESS_TYPE.CREATE;
  if (actionName.includes("update") || actionName.includes("Update")) return BUSINESS_TYPE.UPDATE;
  if (actionName.includes("delete") || actionName.includes("Delete")) return BUSINESS_TYPE.DELETE;
  if (actionName.includes("getByPagination") || actionName.includes("query")) return BUSINESS_TYPE.OTHER;
  if (actionName.includes("getByPk") || actionName.includes("get")) return BUSINESS_TYPE.OTHER;
  if (actionName.includes("export")) return BUSINESS_TYPE.EXPORT;
  if (actionName.includes("import")) return BUSINESS_TYPE.IMPORT;
  return BUSINESS_TYPE.OTHER;
}

function getClientIp(headers: Record<string, string | undefined>): string {
  return (
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    headers["x-real-ip"] ||
    headers["cf-connecting-ip"] ||
    "127.0.0.1"
  );
}

function truncateString(str: string | undefined, maxLength: number = 2000): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}

// Zod to JSON Schema 转换 - 使用类型断言绕过类型检查
function zodToJsonSchema(schema: unknown): Record<string, unknown> | undefined {
  if (!schema) return undefined;
  try {
    // toJSONSchema 期望 ZodTypeAny，这里通过类型断言传入
    return toJSONSchema(schema as Parameters<typeof toJSONSchema>[0]);
  } catch {
    return { type: "unknown", error: "Failed to convert schema" };
  }
}

/**
 * Actions Plugin - 注册所有 actions 路由 + 元数据查询接口
 */
export const actionsPlugin = (allActions: ActionDefinition[]) => {
  // 构建 actions Map 用于快速查找
  const actionsMap = new Map<string, ActionDefinition>();
  for (const action of allActions) {
    actionsMap.set(action.meta.name, action);
  }

  return (app: Elysia) => app
    // GET /api/actions - 获取所有 actions 列表
    .get(
      "/api/actions",
      () => {
        // 过滤掉 ignoreTools: true 和 getSchema 路由
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
      }
    )
    // GET /api/actions/:name - 获取单个 action 详情（含 JSON Schema）
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
            query: zodToJsonSchema(action.schemas.querySchema),
            params: zodToJsonSchema(action.schemas.paramsSchema),
            body: zodToJsonSchema(action.schemas.bodySchema),
          },
          outputSchema: zodToJsonSchema(action.schemas.outputSchema) ?? {},
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
      }
    )
    // 注册所有 action 路由（包括 execute 路由）
    .use((app) => {
      // POST /api/actions/execute/:name - 通过名称执行 action（支持沙盒模式）
      const executeHandler = async (ctx: {
        params: { name: string };
        body: unknown;
        bearer: string | undefined;
        jwt: { verify: (token: string) => Promise<{ sub?: string } | false> };
        set: { status: number };
        headers: Record<string, string | undefined>;
      }): Promise<ApiResponse> => {
        const { params, body, bearer, jwt, set, headers } = ctx;
        const action = actionsMap.get(params.name);
        if (!action) {
          set.status = 404;
          return { data: null, status: 404, message: "Action not found" };
        }

        // 检查 X-Sandbox header，判断是否为沙盒模式
        const isSandbox = headers["x-sandbox"] === "true" || headers["x-sandbox"] === "1";
        
        // 沙盒模式：不需要认证，直接返回模拟输出数据
        if (isSandbox) {
          const mockOutput = action.schemas.outputSchema 
            ? generateFakeData(action.schemas.outputSchema as $ZodType)
            : null;
          return { 
            data: mockOutput, 
            status: 200, 
            message: "ok (sandbox)" 
          };
        }

        // 正常执行模式：需要认证
        const startTime = Date.now();
        let currentUser: CurrentUser | null = null;
        let logStatus = "0";
        let errorMsg: string | null = null;
        let result: unknown = null;

        try {
          // 验证 token
          if (!bearer) {
            set.status = 401;
            logStatus = "1";
            errorMsg = "Unauthorized: No token provided";
            return { data: null, status: 401, message: "Unauthorized: No token provided" };
          }

          const payload = await jwt.verify(bearer);
          if (!payload || !payload.sub) {
            set.status = 401;
            logStatus = "1";
            errorMsg = "Unauthorized: Invalid token";
            return { data: null, status: 401, message: "Unauthorized: Invalid token" };
          }

          const [userResult] = await db
            .select({ id: user.id, name: user.name, loginName: user.loginName })
            .from(user)
            .where(eq(user.id, payload.sub))
            .limit(1);

          if (!userResult) {
            set.status = 401;
            logStatus = "1";
            errorMsg = "Unauthorized: User not found";
            return { data: null, status: 401, message: "Unauthorized: User not found" };
          }
          currentUser = userResult;

          // 正常执行模式
          const input = (body as Record<string, unknown>) ?? {};
          result = await (action.execute as (input: unknown, context: unknown) => Promise<unknown>)(
            input,
            {
              db,
              token: bearer,
              currentUserId: currentUser.id,
              currentUserName: currentUser.name || currentUser.loginName,
            }
          );
          return { data: result, status: 200, message: "ok" };
        } catch (err) {
          logStatus = "1";
          errorMsg = err instanceof Error ? err.message : "Unknown error";
          set.status = 500;
          return { data: null, status: 500, message: errorMsg };
        } finally {
          // 沙盒模式不记录操作日志
          if (!isSandbox && action) {
            const costTime = Date.now() - startTime;
            const businessType = getBusinessType(action.meta.name);
            const isQueryAction = businessType === BUSINESS_TYPE.OTHER;
            const isLogAction =
              action.meta.name.includes("operationLog") || action.meta.name.includes("loginInfo");

            if (!isQueryAction && !isLogAction) {
              const clientIp = getClientIp(headers);
              const paramStr = truncateString(JSON.stringify({ body }));
              const resultStr = truncateString(JSON.stringify(result));

              db.insert(operationLog)
                .values({
                  title: action.meta.displayName,
                  businessType,
                  method: action.meta.name,
                  requestMethod: "POST",
                  name: currentUser?.name || currentUser?.loginName || "unknown",
                  url: `/api/actions/execute/${params.name}`,
                  ip: clientIp,
                  param: paramStr,
                  jsonResult: logStatus === "0" ? resultStr : null,
                  status: logStatus,
                  errorMsg: errorMsg,
                  time: new Date(),
                  costTime: costTime,
                })
                .catch((logErr) => {
                  console.error("Failed to insert operation log:", logErr);
                });
            }
          }
        }
      };

      // 注册 execute 路由
      (app.post as Function)(
        "/api/actions/execute/:name",
        executeHandler,
        {
          detail: {
            summary: "通过名称执行Action",
            description: "通过Action名称执行，支持X-Sandbox header控制沙盒模式。沙盒模式下只验证输入不实际执行，返回模拟数据。",
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

      // 注册所有 action 路由
      for (const action of allActions) {
        const handler = async (ctx: {
          query: Record<string, string>;
          body: unknown;
          params: Record<string, string>;
          bearer: string | undefined;
          jwt: { verify: (token: string) => Promise<{ sub?: string } | false> };
          set: { status: number };
          headers: Record<string, string | undefined>;
        }): Promise<ApiResponse> => {
          const { query, body, params, bearer, jwt, set, headers } = ctx;
          const startTime = Date.now();
          let currentUser: CurrentUser | null = null;
          let logStatus = "0";
          let errorMsg: string | null = null;
          let result: unknown = null;

          try {
            if (!bearer) {
              set.status = 401;
              logStatus = "1";
              errorMsg = "Unauthorized: No token provided";
              return { data: null, status: 401, message: "Unauthorized: No token provided" };
            }

            const payload = await jwt.verify(bearer);
            if (!payload || !payload.sub) {
              set.status = 401;
              logStatus = "1";
              errorMsg = "Unauthorized: Invalid token";
              return { data: null, status: 401, message: "Unauthorized: Invalid token" };
            }

            const [userResult] = await db
              .select({ id: user.id, name: user.name, loginName: user.loginName })
              .from(user)
              .where(eq(user.id, payload.sub))
              .limit(1);

            if (!userResult) {
              set.status = 401;
              logStatus = "1";
              errorMsg = "Unauthorized: User not found";
              return { data: null, status: 401, message: "Unauthorized: User not found" };
            }
            currentUser = userResult;

            const input = {
              ...(query ?? {}),
              ...(params ?? {}),
              ...((body as Record<string, unknown>) ?? {}),
            };
            result = await (action.execute as (input: unknown, context: unknown) => Promise<unknown>)(
              input,
              {
                db,
                token: bearer,
                currentUserId: currentUser.id,
                currentUserName: currentUser.name || currentUser.loginName,
              }
            );
            return { data: result, status: 200, message: "ok" };
          } catch (err) {
            logStatus = "1";
            errorMsg = err instanceof Error ? err.message : "Unknown error";
            set.status = 500;
            return { data: null, status: 500, message: errorMsg };
          } finally {
            const costTime = Date.now() - startTime;
            const businessType = getBusinessType(action.meta.name);
            const isQueryAction = businessType === BUSINESS_TYPE.OTHER;
            const isLogAction =
              action.meta.name.includes("operationLog") || action.meta.name.includes("loginInfo");

            if (!isQueryAction && !isLogAction) {
              const clientIp = getClientIp(headers);
              const paramStr = truncateString(JSON.stringify({ query, body, params }));
              const resultStr = truncateString(JSON.stringify(result));

              db.insert(operationLog)
                .values({
                  title: action.meta.displayName,
                  businessType,
                  method: action.meta.name,
                  requestMethod: action.meta.method,
                  name: currentUser?.name || currentUser?.loginName || "unknown",
                  url: action.meta.path,
                  ip: clientIp,
                  param: paramStr,
                  jsonResult: logStatus === "0" ? resultStr : null,
                  status: logStatus,
                  errorMsg: errorMsg,
                  time: new Date(),
                  costTime: costTime,
                })
                .catch((logErr) => {
                  console.error("Failed to insert operation log:", logErr);
                });
            }
          }
        };

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
    });
};
