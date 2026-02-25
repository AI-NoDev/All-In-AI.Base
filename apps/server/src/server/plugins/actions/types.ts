/**
 * Actions Plugin - 类型定义
 */

export interface CurrentUser {
  id: string;
  name: string | null;
  loginName: string;
  deptId: string | null;
  userType: string | null;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  status: number;
  message: string;
}

export interface ActionSummary {
  name: string;
  displayName: string;
  description: string;
  tags: string[];
  method: string;
  path: string;
}

export interface ActionDetail extends ActionSummary {
  inputSchema: {
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  };
  outputSchema: Record<string, unknown>;
}

export interface ActionHandlerContext {
  query: Record<string, string>;
  body: unknown;
  params: Record<string, string>;
  bearer: string | undefined;
  jwt: { verify: (token: string) => Promise<{ sub?: string } | false> };
  set: { status: number };
  headers: Record<string, string | undefined>;
}

export interface ExecuteHandlerContext {
  params: { name: string };
  body: unknown;
  bearer: string | undefined;
  jwt: { verify: (token: string) => Promise<{ sub?: string } | false> };
  set: { status: number };
  headers: Record<string, string | undefined>;
}
