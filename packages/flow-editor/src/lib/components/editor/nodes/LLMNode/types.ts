import type { Node } from '@xyflow/svelte';

/** LLM 节点数据 */
export interface LLMNodeData extends Record<string, unknown> {
	title: string;
	type: 'llm';
	desc?: string;
	model?: string;
	temperature?: number;
	maxTokens?: number;
	systemPrompt?: string;
}

/** LLM 节点类型 */
export type LLMNode = Node<LLMNodeData, 'llm'>;
