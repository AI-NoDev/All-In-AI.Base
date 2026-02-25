/**
 * 循环中断节点执行器
 * 
 * 用于在循环中提前退出
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';

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
		node: WorkflowNode<BaseNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		// 获取当前循环上下文
		const loopContext = context.loopContext;

		if (!loopContext) {
			throw new Error('循环中断节点只能在循环内使用');
		}

		// 抛出中断信号
		throw new LoopBreakSignal(loopContext.loopId);
	}
}
