/**
 * 循环中断节点执行器
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import type { LoopBreakNodeData } from './types';

/** 循环中断信号 */
export class LoopBreakSignal extends Error {
	readonly loopId: string;

	constructor(loopId: string) {
		super('Loop break signal');
		this.name = 'LoopBreakSignal';
		this.loopId = loopId;
	}
}

export class LoopBreakNodeExecutor implements NodeExecutor {
	async execute(
		_node: WorkflowNode<LoopBreakNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const loopContext = context.loopContext;

		if (!loopContext) {
			throw new Error('循环中断节点只能在循环内使用');
		}

		throw new LoopBreakSignal(loopContext.loopId);
	}
}
