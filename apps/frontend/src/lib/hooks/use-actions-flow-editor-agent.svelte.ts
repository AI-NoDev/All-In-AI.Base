/**
 * useActionsFlowEditorAgent
 * 
 * 封装 useChat，集成 ActionsFlowEditor 的 AI 工具
 */

import { Chat, DefaultChatTransport, type UIMessage } from '@qiyu-allinai/ai/client';
import {
  callActionsFlowEditorTool,
  type ActionsFlowEditorRef,
  type ActionsFlowEditorToolName,
} from '@qiyu-allinai/actions-flow-editor';

/** useActionsFlowEditorAgent 配置 */
interface UseActionsFlowEditorAgentOptions {
  /** API 端点 */
  api?: string;
  /** 编辑器 ref */
  editorRef: ActionsFlowEditorRef;
  /** 初始消息 */
  initialMessages?: UIMessage[];
  /** 请求体附加数据 */
  body?: Record<string, unknown>;
  /** 请求头 */
  headers?: Record<string, string>;
}

/**
 * 创建集成 ActionsFlowEditor 工具的 Chat 实例
 * @param options - 配置选项
 * @returns Chat 实例
 */
export function useActionsFlowEditorAgent(options: UseActionsFlowEditorAgentOptions): Chat<UIMessage> {
  const { editorRef, api, initialMessages, body, headers } = options;

  const chat = new Chat<UIMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api,
      body,
      headers,
    }),
    async onToolCall({ toolCall }) {
      // 跳过动态工具
      if (toolCall.dynamic) return;

      const toolName = toolCall.toolName as ActionsFlowEditorToolName;
      const input = toolCall.input as Record<string, unknown>;

      // 执行工具调用（异步）
      const result = await callActionsFlowEditorTool(editorRef, toolName, input);

      // 返回结果
      chat.addToolOutput({
        tool: toolName,
        toolCallId: toolCall.toolCallId,
        output: result,
      });
    },
  });

  return chat;
}
