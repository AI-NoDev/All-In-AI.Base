/**
 * 问题分类器节点执行器
 * 
 * 使用 LLM 对输入进行分类，返回匹配的分类选项
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';
import { VariableResolver } from '../variable-resolver';
import type { LLMCallFunction } from './llm-executor';

/** 分类选项 */
interface ClassifierOption {
	id: string;
	label: string;
	description?: string;
}

export class ClassifierNodeExecutor implements NodeExecutor {
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
		const options = data.options as ClassifierOption[] | undefined;
		const inputVariable = data.inputVariable as string | undefined;
		const instruction = data.instruction as string | undefined;

		if (!modelConfig) {
			throw new Error('分类器节点未配置模型');
		}

		if (!options || options.length === 0) {
			throw new Error('分类器节点未配置分类选项');
		}

		// 获取输入文本
		const resolver = new VariableResolver(context);
		let inputText = '';
		if (inputVariable) {
			inputText = String(resolver.resolve(inputVariable) ?? '');
		}

		if (!inputText) {
			throw new Error('分类器节点输入为空');
		}

		// 构建分类提示词
		const optionsList = options
			.map((opt, idx) => `${idx + 1}. ${opt.label}${opt.description ? ` - ${opt.description}` : ''}`)
			.join('\n');

		const systemPrompt = `你是一个文本分类器。根据用户输入，从以下选项中选择最匹配的分类。

可选分类：
${optionsList}

${instruction ? `额外指令：${instruction}` : ''}

请只返回分类的编号（如 1、2），不要返回其他内容。`;

		// 调用 LLM 进行分类
		const result = await this.llmCall({
			model: modelConfig.model,
			provider: modelConfig.provider,
			systemPrompt,
			userPrompt: inputText,
			temperature: 0, // 分类任务使用低温度
		});

		// 解析分类结果
		const responseText = result.text.trim();
		const classIndex = parseInt(responseText, 10) - 1;

		let selectedOption: ClassifierOption | undefined;
		if (classIndex >= 0 && classIndex < options.length) {
			selectedOption = options[classIndex];
		} else {
			// 尝试匹配分类名称
			selectedOption = options.find(
				opt => responseText.toLowerCase().includes(opt.label.toLowerCase())
			);
		}

		if (!selectedOption) {
			// 默认选择第一个
			selectedOption = options[0];
		}

		return {
			class_name: selectedOption.label,
			class_id: selectedOption.id,
			class_index: options.indexOf(selectedOption),
			usage: result.tokens,
			_tokens: result.tokens,
		};
	}
}
