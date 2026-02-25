/**
 * Actions Plugin - 请求处理器
 */

import type { TSchema } from "@sinclair/typebox";
import { ActionError } from "@qiyu-allinai/actions";
import type { ActionDefinition } from "@qiyu-allinai/actions";
import db from "@qiyu-allinai/db/connect";
import { user } from "@qiyu-allinai/db/entities/system";
import { eq } from "drizzle-orm";
import type { ApiResponse, CurrentUser, ActionHandlerContext, ExecuteHandlerContext } from "./types";
import { generateFakeData } from "./utils";
import { logOperation } from "./logging";

/**
 * 创建 execute 路由处理器
 */
export function createExecuteHandler(
  actionsMap: Map<string, ActionDefinition>,
  wsConnectionManager?: unknown
) {
  return async (ctx: ExecuteHandlerContext): Promise<ApiResponse> => {
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
        ? generateFakeData(action.schemas.outputSchema as TSchema)
        : null;
      return { data: mockOutput, status: 200, message: "ok (sandbox)" };
    }

    // 正常执行模式
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
        return { data: null, status: 401, message: errorMsg };
      }

      const payload = await jwt.verify(bearer);
      if (!payload || !payload.sub) {
        set.status = 401;
        logStatus = "1";
        errorMsg = "Unauthorized: Invalid token";
        return { data: null, status: 401, message: errorMsg };
      }

      const [userResult] = await db
        .select({ id: user.id, name: user.name, loginName: user.loginName, deptId: user.deptId, userType: user.userType })
        .from(user)
        .where(eq(user.id, payload.sub))
        .limit(1);

      if (!userResult) {
        set.status = 401;
        logStatus = "1";
        errorMsg = "Unauthorized: User not found";
        return { data: null, status: 401, message: errorMsg };
      }
      currentUser = userResult;

      // 执行 action
      const input = (body as Record<string, unknown>) ?? {};
      result = await (action.execute as (input: unknown, context: unknown) => Promise<unknown>)(
        input,
        {
          db,
          token: bearer,
          currentUserId: currentUser.id,
          currentUserName: currentUser.name || currentUser.loginName,
          currentUserDeptId: currentUser.deptId,
          currentUserType: currentUser.userType,
          wsConnectionManager,
        }
      );
      return { data: result, status: 200, message: "ok" };
    } catch (err) {
      logStatus = "1";
      errorMsg = err instanceof Error ? err.message : "Unknown error";
      const status = err instanceof ActionError ? err.status : 500;
      set.status = status;
      return { data: null, status, message: errorMsg };
    } finally {
      // 记录操作日志（沙盒模式不记录）
      if (!isSandbox && action) {
        logOperation({
          action,
          currentUser,
          headers,
          requestData: { body },
          result,
          logStatus,
          errorMsg,
          costTime: Date.now() - startTime,
          url: `/api/actions/execute/${params.name}`,
        });
      }
    }
  };
}

/**
 * 创建 action 路由处理器
 */
export function createActionHandler(
  action: ActionDefinition,
  wsConnectionManager?: unknown
) {
  return async (ctx: ActionHandlerContext): Promise<ApiResponse> => {
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
        return { data: null, status: 401, message: errorMsg };
      }

      const payload = await jwt.verify(bearer);
      if (!payload || !payload.sub) {
        set.status = 401;
        logStatus = "1";
        errorMsg = "Unauthorized: Invalid token";
        return { data: null, status: 401, message: errorMsg };
      }

      const [userResult] = await db
        .select({ id: user.id, name: user.name, loginName: user.loginName, deptId: user.deptId, userType: user.userType })
        .from(user)
        .where(eq(user.id, payload.sub))
        .limit(1);

      if (!userResult) {
        set.status = 401;
        logStatus = "1";
        errorMsg = "Unauthorized: User not found";
        return { data: null, status: 401, message: errorMsg };
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
          currentUserDeptId: currentUser.deptId,
          currentUserType: currentUser.userType,
          wsConnectionManager,
        }
      );
      return { data: result, status: 200, message: "ok" };
    } catch (err) {
      logStatus = "1";
      errorMsg = err instanceof Error ? err.message : "Unknown error";
      const status = err instanceof ActionError ? err.status : 500;
      set.status = status;
      return { data: null, status, message: errorMsg };
    } finally {
      logOperation({
        action,
        currentUser,
        headers,
        requestData: { query, body, params },
        result,
        logStatus,
        errorMsg,
        costTime: Date.now() - startTime,
      });
    }
  };
}
