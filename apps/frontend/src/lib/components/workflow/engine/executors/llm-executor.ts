/**
 * LLM 节点执行器
 * 
 * 这是一个抽象执行器，实际的 LLM 调用需要由外部实现
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';

/** LLM 调用函数类型 */
export type LLMCallFunction = (params: {
	model: string;
	provider: string;
	systemPrompt?: string;
	userPrompt: string;
	temperature?: number;
	maxTokens?: number;
	context?: Record<string, unknown>;
}) => Promise<{
	text: string;
	tokens?: { prompt: number; completion: number; total: number };
}>;

export class LLMNodeExecutor implements NodeExecutor {
	private llmCall: LLMCallFunction;

	constructor(llmCall: LLMCallFunction) {
		this.llmCall = llmCall;
	}

	async execute(
		node: WorkflowNode<BaseNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data as Record<string, unknown>;
		const modelConfig = data.modelConfig as { provider: string; model: string } | undefined;

		if (!modelConfig) {
			throw new Error('LLM 节点未配置模型');
		}

		// 构建用户提示词
		const userPrompt = (inputs.userPromptTemplate as string) ?? '';
		const systemPrompt = inputs.systemPrompt as string | undefined;

		// 调用 LLM
		const result = await this.llmCall({
			model: modelConfig.model,
			provider: modelConfig.provider,
			systemPrompt,
			userPrompt,
			temperature: data.temperature as number | undefined,
			maxTokens: data.maxTokens as number | undefined,
			context: inputs,
		});

		return {
			text: result.text,
			_tokens: result.tokens,
		};
	}
}
