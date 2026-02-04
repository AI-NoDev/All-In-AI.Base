import type { z, ZodType } from 'zod';

/**
 * Action 执行上下文
 */
export interface ActionContext {
  /** 认证 Token */
  token: string;
  /** 当前用户ID */
  currentUserId: string;
  /** 当前用户名 */
  currentUserName: string;
}

/**
 * Action 元数据
 */
export interface ActionMeta {
  /** Action 唯一标识 */
  name: string;
  /** Action 显示名称 */
  displayName: string;
  /** Action 描述 */
  description: string;
  /** Action 分类/标签 */
  tags?: string[];
  /** HTTP Method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 路由路径 (如 /api/agent/:id) */
  path: string;
  /** 是否在 /api/actions 列表中隐藏（用于工具调用场景） */
  ignoreTools?: boolean;
}

/**
 * Action Schemas - Zod 版本 (分离的 query/params/body)
 */
export interface ActionSchemas<
  TQuery extends ZodType = ZodType,
  TParams extends ZodType = ZodType,
  TBody extends ZodType = ZodType,
  TOutput extends ZodType = ZodType,
> {
  querySchema?: TQuery;
  paramsSchema?: TParams;
  bodySchema?: TBody;
  outputSchema: TOutput;
}

/**
 * 合并 query & params & body 的输入类型
 */
export type MergedInput<
  TQuery extends ZodType,
  TParams extends ZodType,
  TBody extends ZodType,
> = (TQuery extends ZodType ? z.infer<TQuery> : {}) &
    (TParams extends ZodType ? z.infer<TParams> : {}) &
    (TBody extends ZodType ? z.infer<TBody> : {});

/**
 * Action 定义
 */
export interface ActionDefinition<
  TQuery extends ZodType = ZodType,
  TParams extends ZodType = ZodType,
  TBody extends ZodType = ZodType,
  TOutput extends ZodType = ZodType,
> {
  meta: ActionMeta;
  schemas: ActionSchemas<TQuery, TParams, TBody, TOutput>;
  execute: (
    input: MergedInput<TQuery, TParams, TBody>,
    context: ActionContext
  ) => Promise<z.infer<TOutput>>;
}

/**
 * Action 注册表类型
 */
export type ActionRegistry = Map<string, ActionDefinition>;
