import type { Node } from '@xyflow/svelte';

/** 输出节点数据 */
export interface OutputNodeData extends Record<string, unknown> {
	title: string;
	type: 'output';
	desc?: string;
	outputVariable?: string;
}

/** 输出节点类型 */
export type OutputNode = Node<OutputNodeData, 'output'>;
