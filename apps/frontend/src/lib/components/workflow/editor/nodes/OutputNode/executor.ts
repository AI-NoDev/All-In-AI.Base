/**
 * 输出节点执行器
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import { VariableResolver } from '$lib/components/workflow/engine/variable-resolver';
import type { OutputNodeData, OutputVariable } from './types';

export class OutputNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<OutputNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data;
		const variables = data.variables;

		if (!variables || variables.length === 0) {
			return {};
		}

		const resolver = new VariableResolver(context);
		const result: Record<string, unknown> = {};

		for (const variable of variables) {
			result[variable.name] = resolver.resolve(variable.value);
		}

		return result;
	}
}
