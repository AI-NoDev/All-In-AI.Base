/**
 * 问题分类器节点执行器
 * 
 * 使用 Chat API 进行分类，输出结构化 JSON
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import { VariableResolver } from '$lib/components/workflow/engine/variable-resolver';
import type { ClassifierNodeData, ClassifierOption } from './types';
import { Chat, DefaultChatTransport } from '@qiyu-allinai/ai/client';
import { authStore } from '$lib/stores/auth.svelte';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';

/** 分类器输出结构 */
interface ClassifierOutput {
	target: string;
}

export class ClassifierNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<ClassifierNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data;
		const modelConfig = data.modelConfig;
		const options = data.options;
		const inputVariable = data.inputVariable;
		const instruction = data.instruction;

		if (!modelConfig) {
			throw new Error('分类器节点未配置模型');
		}

		if (!options || options.length === 0) {
			throw new Error('分类器节点未配置分类选项');
		}

		const resolver = new VariableResolver(context);
		let inputText = '';
		if (inputVariable) {
			inputText = String(resolver.resolve(inputVariable) ?? '');
		}

		if (!inputText) {
			throw new Error('分类器节点输入为空');
		}

		// 构建分类选项列表（使用 id 作为 key）
		const optionKeys = options.map(opt => opt.id);
		const optionsList = options
			.map(opt => `- "${opt.id}": ${opt.label}${opt.description ? ` (${opt.description})` : ''}`)
			.join('\n');

		// 构建结构化输出的 JSON Schema
		const outputSchema = {
			type: 'object',
			properties: {
				target: {
					type: 'string',
					enum: optionKeys,
					description: '选择的分类 ID',
				},
			},
			required: ['target'],
		};

		const systemPrompt = `你是一个文本分类器。根据用户输入，从以下选项中选择最匹配的分类。

可选分类：
${optionsList}

${instruction ? `额外指令：${instruction}` : ''}

你必须返回一个 JSON 对象，格式为 {"target": "分类ID"}，其中分类ID必须是上述选项中的一个。`;

		// 调用 LLM（使用结构化输出）
		const result = await this.callLLM(modelConfig.id, systemPrompt, inputText, outputSchema);

		// 解析分类结果
		let classifierOutput: ClassifierOutput;
		try {
			classifierOutput = JSON.parse(result.text) as ClassifierOutput;
		} catch {
			// 如果解析失败，尝试从文本中提取
			const match = result.text.match(/"target"\s*:\s*"([^"]+)"/);
			if (match) {
				classifierOutput = { target: match[1] };
			} else {
				// 默认选择第一个
				classifierOutput = { target: options[0].id };
			}
		}

		// 验证 target 是否有效
		const selectedOption = options.find(opt => opt.id === classifierOutput.target);
		if (!selectedOption) {
			// 如果无效，选择第一个
			classifierOutput.target = options[0].id;
		}

		return {
			target: classifierOutput.target,
			class_name: selectedOption?.label ?? options[0].label,
			usage: result.usage ?? { prompt: 0, completion: 0, total: 0 },
			_tokens: result.usage,
		};
	}

	/** 调用 LLM API（支持结构化输出） */
	private async callLLM(
		modelId: string,
		systemPrompt: string,
		userPrompt: string,
		outputSchema?: Record<string, unknown>
	): Promise<{ text: string; usage?: { prompt: number; completion: number; total: number } }> {
		const transportBody: Record<string, unknown> = {
			modelId,
			temperature: 0, // 分类任务使用低温度
		};

		// 如果有输出 Schema，添加结构化输出配置
		if (outputSchema) {
			transportBody.responseFormat = {
				type: 'json_schema',
				jsonSchema: {
					name: 'classifier_output',
					schema: outputSchema,
					strict: true,
				},
			};
		}

		const chat = new Chat({
			id: crypto.randomUUID(),
			transport: new DefaultChatTransport({
				api: `${API_BASE}/api/ai/chat`,
				headers: {
					'Authorization': `Bearer ${authStore.accessToken}`,
				},
				body: transportBody,
			}),
		});

		// 发送消息
		await chat.sendMessage({
			text: `${systemPrompt}\n\n用户输入：${userPrompt}`,
		});

		// 等待响应完成
		await this.waitForChatReady(chat);

		// 提取结果
		const assistantMsg = chat.messages.find(m => m.role === 'assistant');
		if (!assistantMsg) {
			throw new Error('未收到 LLM 响应');
		}

		let text = '';
		if (assistantMsg.parts) {
			for (const part of assistantMsg.parts) {
				if (part.type === 'text') {
					text += (part as { type: 'text'; text: string }).text;
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

		return { text, usage };
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
}
