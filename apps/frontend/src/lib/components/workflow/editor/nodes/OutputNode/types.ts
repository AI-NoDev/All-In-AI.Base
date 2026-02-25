import type { Node } from '@xyflow/svelte';

/** 输出变量项 */
export interface OutputVariable {
	id: string;
	/** 变量名 */
	name: string;
	/** 变量值（引用路径，如 start.input 或 llm_1.output） */
	value: string;
}

/** 输出节点数据 */
export interface OutputNodeData extends Record<string, unknown> {
	title: string;
	type: 'output';
	desc?: string;
	/** 输出变量列表 */
	variables?: OutputVariable[];
}

/** 输出节点类型 */
export type OutputNode = Node<OutputNodeData, 'output'>;
