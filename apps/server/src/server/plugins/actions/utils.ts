/**
 * Actions Plugin - 工具函数
 */

import { Value } from "@sinclair/typebox/value";
import type { TSchema } from "@sinclair/typebox";

// ============ Business Type Constants ============
export const BUSINESS_TYPE = {
  OTHER: 0,
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
  AUTHORIZE: 4,
  EXPORT: 5,
  IMPORT: 6,
} as const;

/**
 * 根据 action 名称判断业务类型
 */
export function getBusinessType(actionName: string): number {
  if (actionName.includes("create") || actionName.includes("Create")) return BUSINESS_TYPE.CREATE;
  if (actionName.includes("update") || actionName.includes("Update")) return BUSINESS_TYPE.UPDATE;
  if (actionName.includes("delete") || actionName.includes("Delete")) return BUSINESS_TYPE.DELETE;
  if (actionName.includes("getByPagination") || actionName.includes("query")) return BUSINESS_TYPE.OTHER;
  if (actionName.includes("getByPk") || actionName.includes("get")) return BUSINESS_TYPE.OTHER;
  if (actionName.includes("export")) return BUSINESS_TYPE.EXPORT;
  if (actionName.includes("import")) return BUSINESS_TYPE.IMPORT;
  return BUSINESS_TYPE.OTHER;
}

/**
 * 从请求头获取客户端 IP
 */
export function getClientIp(headers: Record<string, string | undefined>): string {
  return (
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    headers["x-real-ip"] ||
    headers["cf-connecting-ip"] ||
    "127.0.0.1"
  );
}

/**
 * 截断字符串
 */
export function truncateString(str: string | undefined, maxLength: number = 2000): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}

/**
 * TypeBox to JSON Schema 转换 - TypeBox 本身就是 JSON Schema 兼容的
 */
export function schemaToJsonSchema(schema: unknown): Record<string, unknown> | undefined {
  if (!schema) return undefined;
  try {
    return schema as Record<string, unknown>;
  } catch {
    return { type: "unknown", error: "Failed to convert schema" };
  }
}

/**
 * 生成 TypeBox Schema 的模拟数据
 */
export function generateFakeData(schema: TSchema): unknown {
  try {
    return Value.Create(schema);
  } catch {
    return null;
  }
}
