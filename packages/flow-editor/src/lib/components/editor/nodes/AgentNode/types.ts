import type { Node } from '@xyflow/svelte';

/** Agent节点数据 */
export interface AgentNodeData extends Record<string, unknown> {
	title: string;
	type: 'agent';
	desc?: string;
	agentId?: string;
	agentName?: string;
	maxIterations?: number;
}

/** Agent节点类型 */
export type AgentNode = Node<AgentNodeData, 'agent'>;
