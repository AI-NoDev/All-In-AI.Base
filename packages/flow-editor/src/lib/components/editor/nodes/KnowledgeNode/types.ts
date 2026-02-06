import type { Node } from '@xyflow/svelte';

/** 知识检索节点数据 */
export interface KnowledgeNodeData extends Record<string, unknown> {
	title: string;
	type: 'knowledge';
	desc?: string;
	knowledgeBaseId?: string;
	topK?: number;
	scoreThreshold?: number;
}

/** 知识检索节点类型 */
export type KnowledgeNode = Node<KnowledgeNodeData, 'knowledge'>;
