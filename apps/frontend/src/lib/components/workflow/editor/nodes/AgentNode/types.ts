import type { Node } from '@xyflow/svelte';

/** 运行状态 */
export type RunStatus = 'idle' | 'running' | 'success' | 'failed';

/** Agent 信息（从数据库获取） */
export interface AgentInfo {
	id: string;
	name: string;
	description?: string | null;
	avatar?: string | null;
	color?: string | null;
	inputSchema?: Record<string, unknown> | null;
	outputSchema?: Record<string, unknown> | null;
}

/** 输出变量定义 */
export interface OutputVariable {
	name: string;
	type: string;
	description: string;
}

/** 内置输出变量 */
export const BUILTIN_OUTPUT_VARIABLES: OutputVariable[] = [
	{ name: 'output', type: 'string', description: 'Agent 输出结果' },
	{ name: 'structured_output', type: 'object', description: '结构化输出（如果配置了 outputSchema）' },
];

/** 运行结果数据 */
export interface AgentRunResult {
	status: RunStatus;
	startedAt?: string;
	endedAt?: string;
	duration?: number;
	tokenUsage?: {
		prompt: number;
		completion: number;
		total: number;
	};
	inputs?: Record<string, unknown>;
	outputs?: Record<string, unknown>;
	error?: string;
}

/** Agent节点数据 */
export interface AgentNodeData extends Record<string, unknown> {
	title: string;
	type: 'agent';
	desc?: string;
	/** 选中的 Agent ID */
	agentId?: string;
	/** Agent 名称（用于显示） */
	agentName?: string;
	/** Agent 头像 */
	agentAvatar?: string;
	/** Agent 颜色 */
	agentColor?: string;
	/** Agent 输入 Schema */
	agentInputSchema?: Record<string, unknown>;
	/** Agent 输出 Schema */
	agentOutputSchema?: Record<string, unknown>;
	/** 最大迭代次数 */
	maxIterations?: number;
	/** 上次运行结果 */
	lastRun?: AgentRunResult;
}

/** Agent节点类型 */
export type AgentNode = Node<AgentNodeData, 'agent'>;
