/**
 * LLM 节点执行器
 * 
 * 使用 @qiyu-allinai/ai/client 的 Chat API 进行 LLM 调用
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import { VariableResolver } from '$lib/components/workflow/engine/variable-resolver';
import type { LLMNodeData } from './types';
import { Chat, DefaultChatTransport } from '@qiyu-allinai/ai/client';
import { authStore } from '$lib/stores/auth.svelte';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';

/** LLM 执行结果 */
export interface LLMExecuteResult {
	text: string;
	reasoning_content?: string;
	usage?: {
		prompt: number;
		completion: number;
		total: number;
	};
}

export class LLMNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<LLMNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data;
		const modelConfig = data.modelConfig;

		if (!modelConfig) {
			throw new Error('LLM 节点未配置模型');
		}

		// 解析变量
		const resolver = new VariableResolver(context);

		// 构建消息列表
		const messages = this.buildMessages(data, resolver);
		
		if (messages.length === 0) {
			throw new Error('LLM 节点没有配置提示词');
		}

		// 重试逻辑
		const maxRetries = data.retryOnFailure ? (data.retryCount ?? 3) : 1;
		const retryInterval = data.retryInterval ?? 1000;
		let lastError: Error | null = null;

		for (let attempt = 0; attempt < maxRetries; attempt++) {
			try {
				const result = await this.callLLM(modelConfig.id, messages, data);
				return {
					text: result.text,
					reasoning_content: result.reasoning_content ?? '',
					usage: result.usage,
					_tokens: result.usage ? {
						prompt: result.usage.prompt,
						completion: result.usage.completion,
						total: result.usage.total,
					} : undefined,
				};
			} catch (err) {
				lastError = err instanceof Error ? err : new Error(String(err));
				if (attempt < maxRetries - 1) {
					await this.sleep(retryInterval);
				}
			}
		}

		// 处理异常
		if (data.exceptionHandling === 'default_value') {
			return {
				text: data.defaultValue ?? '',
				reasoning_content: '',
				usage: undefined,
			};
		}

		throw lastError ?? new Error('LLM 调用失败');
	}

	/** 构建消息列表 */
	private buildMessages(data: LLMNodeData, resolver: VariableResolver): Array<{ role: string; content: string }> {
		const messages: Array<{ role: string; content: string }> = [];

		if (data.promptMessages && data.promptMessages.length > 0) {
			for (const msg of data.promptMessages) {
				const resolvedContent = resolver.resolveTemplate(msg.content);
				if (resolvedContent.trim()) {
					messages.push({
						role: msg.role,
						content: resolvedContent,
					});
				}
			}
		}

		return messages;
	}

	/** 调用 LLM API */
	private async callLLM(
		modelId: string,
		messages: Array<{ role: string; content: string }>,
		data: LLMNodeData
	): Promise<LLMExecuteResult> {
		// 创建 Chat 实例
		const chat = new Chat({
			id: crypto.randomUUID(),
			transport: new DefaultChatTransport({
				api: `${API_BASE}/api/ai/chat`,
				headers: {
					'Authorization': `Bearer ${authStore.accessToken}`,
				},
				body: {
					modelId,
					temperature: data.temperature,
					maxTokens: data.maxTokens,
					topP: data.topP,
				},
			}),
		});

		// 如果有 system 消息，先设置
		const systemMsg = messages.find(m => m.role === 'system');
		const userMessages = messages.filter(m => m.role !== 'system');

		// 构建用户消息（合并所有非 system 消息）
		const userContent = userMessages.map(m => {
			if (m.role === 'assistant') {
				return `[Assistant]: ${m.content}`;
			}
			return m.content;
		}).join('\n\n');

		// 发送消息
		await chat.sendMessage({
			text: systemMsg ? `${systemMsg.content}\n\n${userContent}` : userContent,
		});

		// 等待响应完成
		await this.waitForChatReady(chat);

		// 提取结果
		const assistantMsg = chat.messages.find(m => m.role === 'assistant');
		if (!assistantMsg) {
			throw new Error('未收到 LLM 响应');
		}

		// 提取文本内容
		let text = '';
		let reasoning = '';

		if (assistantMsg.parts) {
			for (const part of assistantMsg.parts) {
				if (part.type === 'text') {
					text += (part as { type: 'text'; text: string }).text;
				} else if (part.type === 'reasoning') {
					reasoning += (part as { type: 'reasoning'; text: string }).text;
				}
			}
		}

		// 提取 usage（metadata 直接就是 usage 对象）
		const metadata = (assistantMsg as unknown as { metadata?: { inputTokens?: number; outputTokens?: number; totalTokens?: number } }).metadata;
		const usage = metadata ? {
			prompt: metadata.inputTokens ?? 0,
			completion: metadata.outputTokens ?? 0,
			total: metadata.totalTokens ?? 0,
		} : undefined;

		return {
			text,
			reasoning_content: reasoning || undefined,
			usage,
		};
	}

	/** 等待 Chat 完成 */
	private waitForChatReady(chat: Chat, timeout = 60000): Promise<void> {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();
			
			const checkReady = setInterval(() => {
				if (chat.status === 'ready') {
					clearInterval(checkReady);
					resolve();
				} else if (chat.status === 'error') {
					clearInterval(checkReady);
					reject(new Error('Chat 请求失败'));
				} else if (Date.now() - startTime > timeout) {
					clearInterval(checkReady);
					reject(new Error('Chat 请求超时'));
				}
			}, 100);
		});
	}

	/** 延迟 */
	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
