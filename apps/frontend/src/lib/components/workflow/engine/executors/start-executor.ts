/**
 * 开始节点执行器
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';

export class StartNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<BaseNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		// 开始节点直接返回用户输入
		return { ...context.userInputs };
	}
}
