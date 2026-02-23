import type { TSchema, Static } from '@sinclair/typebox';
import type { PgDatabase } from 'drizzle-orm/pg-core';

/**
 * Drizzle Database 类型 (兼容 postgres-js 和 PGlite)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DrizzleDB = PgDatabase<any, any, any>;

/**
 * 嵌入服务接口（用于向量生成）
 */
export interface EmbeddingService {
  /** 生成文本的向量嵌入 */
  generateEmbedding(text: string): Promise<number[]>;
  /** 批量生成向量嵌入 */
  generateEmbeddings?(texts: string[]): Promise<number[][]>;
}

/**
 * Action 执行上下文
 */
export interface ActionContext {
  /** Drizzle 数据库实例 */
  db: DrizzleDB;
  /** 认证 Token */
  token: string;
  /** 当前用户ID */
  currentUserId: string;
  /** 当前用户名 */
  currentUserName: string;
  /** 当前用户部门ID */
  currentUserDeptId?: string | null;
  /** 当前用户类型 (00=系统管理员) */
  currentUserType?: string | null;
  /** WebSocket 连接管理器（可选，用于 WS 相关 actions） */
  wsConnectionManager?: unknown;
  /** 嵌入服务（可选，用于向量生成） */
  embeddingService?: EmbeddingService;
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
 * Action Schemas - TypeBox 版本 (分离的 query/params/body)
 */
export interface ActionSchemas<
  TQuery extends TSchema = TSchema,
  TParams extends TSchema = TSchema,
  TBody extends TSchema = TSchema,
  TOutput extends TSchema = TSchema,
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
  TQuery extends TSchema,
  TParams extends TSchema,
  TBody extends TSchema,
> = (TQuery extends TSchema ? Static<TQuery> : object) &
    (TParams extends TSchema ? Static<TParams> : object) &
    (TBody extends TSchema ? Static<TBody> : object);

/**
 * Action 定义
 */
export interface ActionDefinition<
  TQuery extends TSchema = TSchema,
  TParams extends TSchema = TSchema,
  TBody extends TSchema = TSchema,
  TOutput extends TSchema = TSchema,
> {
  meta: ActionMeta;
  schemas: ActionSchemas<TQuery, TParams, TBody, TOutput>;
  execute: (
    input: MergedInput<TQuery, TParams, TBody>,
    context: ActionContext
  ) => Promise<Static<TOutput>>;
}

/**
 * Action 注册表类型
 */
export type ActionRegistry = Map<string, ActionDefinition>;
