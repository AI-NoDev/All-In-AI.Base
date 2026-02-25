/**
 * Actions Plugin - 操作日志记录
 */

import db from "@qiyu-allinai/db/connect";
import { operationLog } from "@qiyu-allinai/db/entities/system";
import type { CurrentUser } from "./types";
import { getBusinessType, getClientIp, truncateString, BUSINESS_TYPE } from "./utils";

interface LogParams {
  action: {
    meta: {
      name: string;
      displayName: string;
      method: string;
      path: string;
    };
  };
  currentUser: CurrentUser | null;
  headers: Record<string, string | undefined>;
  requestData: {
    query?: Record<string, string>;
    body?: unknown;
    params?: Record<string, string>;
  };
  result: unknown;
  logStatus: string;
  errorMsg: string | null;
  costTime: number;
  url?: string;
}

/**
 * 记录操作日志
 */
export function logOperation(params: LogParams): void {
  const { action, currentUser, headers, requestData, result, logStatus, errorMsg, costTime, url } = params;
  
  const businessType = getBusinessType(action.meta.name);
  const isQueryAction = businessType === BUSINESS_TYPE.OTHER;
  const isLogAction = action.meta.name.includes("operationLog") || action.meta.name.includes("loginInfo");

  // 查询操作和日志相关操作不记录
  if (isQueryAction || isLogAction) return;

  const clientIp = getClientIp(headers);
  const paramStr = truncateString(JSON.stringify(requestData));
  const resultStr = truncateString(JSON.stringify(result));

  db.insert(operationLog)
    .values({
      title: action.meta.displayName,
      businessType,
      method: action.meta.name,
      requestMethod: action.meta.method,
      name: currentUser?.name || currentUser?.loginName || "unknown",
      url: url || action.meta.path,
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
