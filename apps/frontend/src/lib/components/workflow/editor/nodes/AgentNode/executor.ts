/**
 * Agent 节点执行器
 * 使用 @qiyu-allinai/ai/client 的 Chat API 调用 Agent
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import type { AgentNodeData, ToolCallStep } from './types';
import { Chat, DefaultChatTransport } from '@qiyu-allinai/ai/client';
import { authStore } from '$lib/stores/auth.svelte';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';

/** Agent 文件输出 */
export interface AgentFile {
	name: string;
	type: string;
	size: number;
	url?: string;
	content?: string;
}

/** Agent 调用参数（保留用于外部调用） */
export interface AgentCallParams {
	agentId: string;
	inputs: Record<string, unknown>;
	maxSteps?: number;
	mcpServerIds?: string[];
	instructionPrompt?: string;
	context?: ExecutionContext;
}

/** Agent 调用结果 */
export interface AgentCallResult {
	text: string;
	files?: AgentFile[];
	json?: Record<string, unknown>[];
	usage?: { prompt: number; completion: number; total: number };
	toolCalls?: ToolCallStep[];
}

/** Agent 调用函数类型（保留用于外部注入） */
export type AgentCallFunction = (params: AgentCallParams) => Promise<AgentCallResult>;

export class AgentNodeExecutor implements NodeExecutor {
	private agentCall?: AgentCallFunction;

	constructor(agentCall?: AgentCallFunction) {
		this.agentCall = agentCall;
	}

	async execute(
		node: WorkflowNode<AgentNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data;
		const agentId = data.agentId;
		const maxSteps = data.maxSteps ?? 10;
		const mcpServerIds = data.mcpServerIds ?? [];
		// 优先使用已解析的指令提示词（包含变量替换），否则使用原始配置
		const instructionPrompt = (inputs._resolvedInstructionPrompt as string) ?? data.instructionPrompt ?? '';
		const agentInputSchema = data.agentInputSchema;

		if (!agentId) {
			throw new Error('Agent 节点未选择 Agent');
		}

		const resolvedInputs: Record<string, unknown> = {};

		// 根据 Agent 输入 Schema 解析输入
		if (agentInputSchema && typeof agentInputSchema === 'object') {
			const properties = (agentInputSchema as { properties?: Record<string, unknown> }).properties;
			if (properties) {
				for (const key of Object.keys(properties)) {
					if (inputs[key] !== undefined) {
						resolvedInputs[key] = inputs[key];
					}
				}
			}
		}

		// 合并其他输入
		Object.assign(resolvedInputs, inputs);

		// 如果提供了外部 agentCall 函数，优先使用
		if (this.agentCall) {
			const result = await this.agentCall({
				agentId,
				inputs: resolvedInputs,
				maxSteps,
				mcpServerIds,
				instructionPrompt,
				context,
			});
			return {
				text: result.text,
				files: result.files ?? [],
				json: result.json ?? [],
				usage: result.usage ?? { prompt: 0, completion: 0, total: 0 },
				toolCalls: result.toolCalls ?? [],
				_tokens: result.usage,
			};
		}

		// 使用 Chat API 调用 Agent
		const result = await this.callAgent(agentId, resolvedInputs, maxSteps, mcpServerIds, instructionPrompt);

		return {
			text: result.text,
			files: result.files ?? [],
			json: result.json ?? [],
			usage: result.usage ?? { prompt: 0, completion: 0, total: 0 },
			toolCalls: result.toolCalls ?? [],
			_tokens: result.usage,
		};
	}

	/** 使用 Chat API 调用 Agent */
	private async callAgent(
		agentId: string,
		inputs: Record<string, unknown>,
		maxSteps: number,
		mcpServerIds: string[],
		instructionPrompt?: string
	): Promise<AgentCallResult> {
		// 指令提示词就是发送给 AI 的 user message
		// inputs 中的变量可以在 instructionPrompt 中通过模板引用（已在 workflow-engine 中解析）
		const userMessage = instructionPrompt?.trim() || '';

		if (!userMessage) {
			throw new Error('Agent 节点指令提示词为空');
		}

		// 创建 Chat 实例，使用 agentId
		const chat = new Chat({
			id: crypto.randomUUID(),
			transport: new DefaultChatTransport({
				api: `${API_BASE}/api/ai/chat`,
				headers: {
					'Authorization': `Bearer ${authStore.accessToken}`,
				},
				body: {
					agentId,
					maxSteps,
					mcpServerIds: mcpServerIds.length > 0 ? mcpServerIds : undefined,
				},
			}),
		});

		// 发送消息
		await chat.sendMessage({
			text: userMessage,
		});

		// 等待响应完成
		await this.waitForChatReady(chat);

		// 提取结果
		const assistantMsg = chat.messages.find(m => m.role === 'assistant');
		if (!assistantMsg) {
			throw new Error('未收到 Agent 响应');
		}

		// 提取文本内容、文件和工具调用记录
		let text = '';
		const files: AgentFile[] = [];
		const jsonData: Record<string, unknown>[] = [];
		const toolCalls: ToolCallStep[] = [];

		if (assistantMsg.parts) {
			for (const part of assistantMsg.parts) {
				if (part.type === 'text') {
					text += (part as { type: 'text'; text: string }).text;
				} else if (part.type === 'file') {
					const filePart = part as { type: 'file'; name?: string; mimeType?: string; size?: number; url?: string };
					files.push({
						name: filePart.name ?? 'unknown',
						type: filePart.mimeType ?? 'application/octet-stream',
						size: filePart.size ?? 0,
						url: filePart.url,
					});
				} else if (part.type?.startsWith('tool-')) {
					// 工具调用记录
					// type 格式: tool-{toolName}，如 tool-knowledge_node_create
					const toolPart = part as unknown as {
						type: string;
						toolCallId: string;
						state: string;
						input?: unknown;
						output?: unknown;
						errorText?: string;
					};
					
					const callId = toolPart.toolCallId;
					if (!callId) continue;
					
					// 从 type 中提取工具名称：tool-xxx -> xxx
					const toolName = part.type.replace(/^tool-/, '');
					
					// 查找或创建工具调用记录
					let existingCall = toolCalls.find(tc => tc.id === callId);
					if (!existingCall) {
						existingCall = {
							id: callId,
							name: toolName,
							args: (toolPart.input || {}) as Record<string, unknown>,
							status: 'pending',
							startTime: Date.now(),
						};
						toolCalls.push(existingCall);
					}
					
					// 根据 state 更新状态
					// state: output-available (成功), output-error (失败), call (调用中)
					if (toolPart.state === 'output-available') {
						existingCall.status = 'success';
						existingCall.result = toolPart.output;
						existingCall.endTime = Date.now();
						// 如果结果是对象，添加到 jsonData
						if (toolPart.output && typeof toolPart.output === 'object') {
							jsonData.push(toolPart.output as Record<string, unknown>);
						}
					} else if (toolPart.state === 'output-error') {
						existingCall.status = 'error';
						existingCall.error = toolPart.errorText || '工具调用失败';
						existingCall.endTime = Date.now();
					} else if (toolPart.state === 'call' || toolPart.state === 'partial-call') {
						existingCall.status = 'running';
					}
				}
			}
		}

		// 提取 usage
		const metadata = (assistantMsg as unknown as { metadata?: { inputTokens?: number; outputTokens?: number; totalTokens?: number } }).metadata;
		const usage = metadata ? {
			prompt: metadata.inputTokens ?? 0,
			completion: metadata.outputTokens ?? 0,
			total: metadata.totalTokens ?? 0,
		} : undefined;

		return {
			text,
			files: files.length > 0 ? files : undefined,
			json: jsonData.length > 0 ? jsonData : undefined,
			usage,
			toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
		};
	}

	/** 等待 Chat 完成 */
	private waitForChatReady(chat: Chat, timeout = 120000): Promise<void> {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();
			
			const checkReady = setInterval(() => {
				if (chat.status === 'ready') {
					clearInterval(checkReady);
					resolve();
				} else if (chat.status === 'error') {
					clearInterval(checkReady);
					reject(new Error('Agent 请求失败'));
				} else if (Date.now() - startTime > timeout) {
					clearInterval(checkReady);
					reject(new Error('Agent 请求超时'));
				}
			}, 100);
		});
	}
}
