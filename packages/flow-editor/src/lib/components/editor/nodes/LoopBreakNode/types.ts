import type { BaseNodeData } from '$lib/types/index.js';
import type { Node } from '@xyflow/svelte';

/** 退出循环节点数据 */
export interface LoopBreakNodeData extends BaseNodeData {
	type: 'loop-break';
	/** 退出条件描述（可选） */
	reason?: string;
}

export type LoopBreakNode = Node<LoopBreakNodeData>;
