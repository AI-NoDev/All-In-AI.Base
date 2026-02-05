/**
 * Actions Flow Editor - Server Types
 */

import type {
  WorkflowDefinition,
  FlowNode,
  FlowEdge,
} from '../types.js';

/** Action 执行上下文 */
export interface ActionContext {
  token?: string;
  currentUserId: string;
  currentUserName: string;
}

/** Action 定义（简化版，用于服务端） */
export interface ActionDefinition {
  name: string;
  execute: (input: Record<string, unknown>, context: ActionContext) => Promise<unknown>;
}

/** 获取 Action 的函数类型 */
export type GetActionByName = (name: string) => ActionDefinition | undefined;

/** 流程执行结果 */
export interface FlowExecutionResult {
  success: boolean;
  output?: unknown;
  error?: string;
  nodeResults?: Map<string, NodeExecutionResult>;
}

/** 节点执行结果 */
export interface NodeExecutionResult {
  nodeId: string;
  nodeType: string;
  input: Record<string, unknown>;
  output: unknown;
  error?: string;
  duration: number;
}

/** 流程执行器配置 */
export interface FlowExecutorConfig {
  /** 获取 Action 的函数 */
  getActionByName: GetActionByName;
  /** 执行上下文 */
  context: ActionContext;
  /** 最大循环次数（防止无限循环） */
  maxLoopIterations?: number;
  /** 节点执行超时（毫秒） */
  nodeTimeout?: number;
}

export type { WorkflowDefinition, FlowNode, FlowEdge };
