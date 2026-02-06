import type { Node } from '@xyflow/svelte';

/** 分类选项 */
export interface ClassifierOption {
	id: string;
	label: string;
	description?: string;
}

/** 问题分类器节点数据 */
export interface ClassifierNodeData extends Record<string, unknown> {
	title: string;
	type: 'classifier';
	desc?: string;
	model?: string;
	options?: ClassifierOption[];
}

/** 问题分类器节点类型 */
export type ClassifierNode = Node<ClassifierNodeData, 'classifier'>;
