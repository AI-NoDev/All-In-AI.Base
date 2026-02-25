/**
 * 循环节点执行器
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';
import { VariableResolver } from '../variable-resolver';

/** 循环变量定义 */
interface LoopVariable {
	name: string;
	value: string;
}

export class LoopNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<BaseNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data as Record<string, unknown>;
		const variables = data.variables as LoopVariable[] | undefined;
		const maxIterations = (data.maxIterations as number) ?? 10;

		// 获取要迭代的数组
		const resolver = new VariableResolver(context);
		let items: unknown[] = [];

		if (variables && variables.length > 0) {
			const firstVar = variables[0];
			const value = resolver.resolve(firstVar.value);
			if (Array.isArray(value)) {
				items = value;
			}
		}

		// 限制迭代次数
		const iterationCount = Math.min(items.length, maxIterations);

		return {
			items,
			count: iterationCount,
			maxIterations,
		};
	}
}
