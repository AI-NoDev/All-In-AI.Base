/**
 * 循环节点执行器
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import { VariableResolver } from '$lib/components/workflow/engine/variable-resolver';
import type { LoopNodeData } from './types';

export class LoopNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<LoopNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data;
		const variables = data.variables;
		const maxIterations = data.maxIterations ?? 10;

		const resolver = new VariableResolver(context);
		let items: unknown[] = [];

		if (variables && variables.length > 0) {
			const firstVar = variables[0];
			const value = resolver.resolve(firstVar.value);
			if (Array.isArray(value)) {
				items = value;
			}
		}

		const iterationCount = Math.min(items.length, maxIterations);

		return {
			items,
			count: iterationCount,
			maxIterations,
		};
	}
}
