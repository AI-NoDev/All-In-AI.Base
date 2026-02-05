import type { UIMessage, ChatInit, ChatRequestOptions } from 'ai';

/** 消息角色 */
export type MessageRole = 'system' | 'user' | 'assistant';

/** 消息状态 */
export type MessageStatus = 'submitted' | 'streaming' | 'ready' | 'error';

/** 文件附件 */
export interface FileAttachment {
  name: string;
  type: string;
  url: string;
  size?: number;
}

/** 工具调用 */
export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

/** 工具结果 */
export interface ToolResult {
  toolCallId: string;
  result: unknown;
}

/** 聊天消息（简化版） */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  status?: MessageStatus;
  createdAt?: Date;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  files?: FileAttachment[];
}

/** Chat 配置选项（简化版，完整版请使用 ChatInit） */
export interface ChatOptions {
  /** API 端点 */
  api?: string;
  /** 聊天 ID */
  id?: string;
  /** 初始消息 */
  initialMessages?: UIMessage[];
  /** 请求头 */
  headers?: Record<string, string>;
  /** 额外请求体 */
  body?: Record<string, unknown>;
}

/** Completion 配置选项 */
export interface CompletionOptions {
  /** API 端点 */
  api?: string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 额外请求体 */
  body?: Record<string, unknown>;
}

// Re-export for convenience
export type { UIMessage, ChatInit, ChatRequestOptions };
