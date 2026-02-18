/**
 * AI Plugin 类型定义
 */

import type { UIMessage, ToolSet } from '@qiyu-allinai/ai';
import type { ActionContext } from '@qiyu-allinai/actions';

// ============ Flow Executor Types ============

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface FlowNode {
  id: string;
  type?: string;
  data: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface FlowActionContext {
  token?: string;
  currentUserId: string;
  currentUserName: string;
}

export interface FlowActionDefinition {
  name: string;
  execute: (input: Record<string, unknown>, context: FlowActionContext) => Promise<unknown>;
}

export type GetActionByName = (name: string) => FlowActionDefinition | undefined;

export interface FlowExecutionResult {
  success: boolean;
  output?: unknown;
  error?: string;
}

export interface FlowExecutorConfig {
  getActionByName: GetActionByName;
  context: FlowActionContext;
  maxLoopIterations?: number;
}

export type UtilType = 
  | 'toString' | 'toNumber' | 'toBoolean' | 'isType'
  | 'arrayCount' | 'arrayGet' | 'arrayFirst' | 'arrayLast' | 'arrayJoin'
  | 'add' | 'subtract' | 'multiply' | 'divide' | 'modulo'
  | 'equal' | 'notEqual' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual'
  | 'and' | 'or' | 'not'
  | 'concat' | 'substring' | 'stringLength' | 'toUpperCase' | 'toLowerCase' | 'trim' | 'split' | 'replace' | 'includes';

// ============ AI Plugin Types ============

/** JWT 上下文类型 */
export interface JwtContext {
  jwt: {
    sign: (payload: Record<string, unknown>) => Promise<string>;
    verify: (token: string) => Promise<Record<string, unknown> | null>;
  };
}

/** Bearer 上下文类型 */
export interface BearerContext {
  bearer?: string;
}

/** 消息部分类型 */
export interface MessagePart {
  type: string;
  text?: string;
  mediaType?: string;
  url?: string;
}

/** 输入消息类型 */
export interface InputMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content?: string;
  parts?: MessagePart[];
}

/** 客户端工具定义 */
export interface ClientToolDefinition {
  description: string;
  parameters: Record<string, unknown>;
}

/** Agent 配置 */
export interface AgentConfig {
  agent: {
    id: string;
    systemPrompt: string | null;
    maxLoops: number | null;
  };
  model: {
    id: string;
    modelId: string;
    supportThinking?: boolean;
    reasoningEffort?: string;
  };
  provider: {
    name: string;
    providerType: string;
    baseUrl: string;
    token: string;
  };
  tools: ToolSet;
}

/** Model 配置 */
export interface ModelConfig {
  model: {
    id: string;
    modelId: string;
    providerId: string;
    status: string;
    supportThinking?: boolean | null;
    reasoningEffort?: string | null;
    [key: string]: unknown;
  };
  provider: {
    id: string;
    name: string;
    providerType: string;
    baseUrl: string;
    token: string;
    status: string;
    [key: string]: unknown;
  };
}

/** 聊天请求上下文 */
export interface ChatRequestContext {
  actionContext: ActionContext;
  normalizedMessages: UIMessage[];
  clientTools?: Record<string, ClientToolDefinition>;
  toolChoice?: 'auto' | 'none' | 'required';
  maxSteps?: number;
  system?: string;
}
