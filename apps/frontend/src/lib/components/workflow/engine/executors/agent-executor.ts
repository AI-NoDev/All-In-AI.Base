/**
 * Agent 节点执行器
 * 
 * 调用预定义的 Agent 执行任务
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';
import { VariableResolver } from '../variable-resolver';

/** Agent 调用函数类型 */
export type AgentCallFunction = (params: {
	agentId: string;
	inputs: Record<string, unknown>;
	maxIterations?: number;
	context?: ExecutionContext;
}) => Promise<{
	output: string;
	structured_output?: Record<string, unknown>;
	tokens?: { prompt: number; completion: number; total: number };
}>;

export class AgentNodeExecutor implements NodeExecutor {
	private agentCall?: AgentCallFunction;

	constructor(agentCall?: AgentCallFunction) {
		this.agentCall = agentCall;
	}

	async execute(
		node: WorkflowNode<BaseNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data as Record<string, unknown>;
		const agentId = data.agentId as string | undefined;
		const agentName = data.agentName as string | undefined;
		const maxIterations = (data.maxIterations as number) ?? 10;
		const agentInputSchema = data.agentInputSchema as Record<string, unknown> | undefined;

		if (!agentId) {
			throw new Error('Agent 节点未选择 Agent');
		}

		// 解析输入变量
		const resolver = new VariableResolver(context);
		const resolvedInputs: Record<string, unknown> = {};

		// 如果有输入 schema，按 schema 解析输入
		if (agentInputSchema && typeof agentInputSchema === 'object') {
			const properties = (agentInputSchema as { properties?: Record<string, unknown> }).properties;
			if (properties) {
				for (const [key, _schema] of Object.entries(properties)) {
					// 尝试从 inputs 或 context 中获取值
					if (inputs[key] !== undefined) {
						resolvedInputs[key] = inputs[key];
					}
				}
			}
		}

		// 合并所有输入
		Object.assign(resolvedInputs, inputs);

		// 如果没有提供 Agent 调用函数，返回模拟数据
		if (!this.agentCall) {
			return this.getMockResult(agentId, agentName, resolvedInputs);
		}

		// 调用 Agent
		const result = await this.agentCall({
			agentId,
			inputs: resolvedInputs,
			maxIterations,
			context,
		});

		return {
			output: result.output,
			structured_output: result.structured_output ?? {},
			_tokens: result.tokens,
		};
	}

	/** 返回模拟结果（用于测试） */
	private getMockResult(
		agentId: string,
		agentName: string | undefined,
		inputs: Record<string, unknown>
	): Record<string, unknown> {
		const inputSummary = Object.entries(inputs)
			.map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
			.join(', ');

		return {
			output: `[模拟输出] Agent "${agentName ?? agentId}" 已处理输入: ${inputSummary || '(无输入)'}`,
			structured_output: {
				agent_id: agentId,
				processed: true,
				mock: true,
			},
		};
	}
}
