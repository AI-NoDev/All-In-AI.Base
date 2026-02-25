/**
 * 输出节点执行器
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';
import { VariableResolver } from '../variable-resolver';

/** 输出变量定义 */
interface OutputVariable {
	name: string;
	value: string;
	type?: string;
}

export class OutputNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<BaseNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data as Record<string, unknown>;
		const outputs = data.outputs as OutputVariable[] | undefined;

		if (!outputs || outputs.length === 0) {
			return {};
		}

		const resolver = new VariableResolver(context);
		const result: Record<string, unknown> = {};

		for (const output of outputs) {
			result[output.name] = resolver.resolve(output.value);
		}

		return result;
	}
}
