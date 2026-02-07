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

/** 模拟 Agent 列表（实际应从 API 获取） */
export const MOCK_AGENTS: AgentInfo[] = [
	{
		id: 'agent-1',
		name: '智能客服助手',
		description: '处理客户咨询和问题解答',
		color: '#10b981',
		inputSchema: {
			type: 'object',
			properties: {
				query: { type: 'string', description: '用户问题' },
				context: { type: 'string', description: '上下文信息' },
			},
			required: ['query'],
		},
		outputSchema: {
			type: 'object',
			properties: {
				answer: { type: 'string', description: '回答内容' },
				confidence: { type: 'number', description: '置信度' },
			},
		},
	},
	{
		id: 'agent-2',
		name: '代码审查助手',
		description: '自动审查代码并提供改进建议',
		color: '#6366f1',
		inputSchema: {
			type: 'object',
			properties: {
				code: { type: 'string', description: '待审查代码' },
				language: { type: 'string', description: '编程语言' },
			},
			required: ['code'],
		},
		outputSchema: {
			type: 'object',
			properties: {
				issues: { type: 'array', description: '发现的问题' },
				suggestions: { type: 'array', description: '改进建议' },
			},
		},
	},
	{
		id: 'agent-3',
		name: '数据分析助手',
		description: '分析数据并生成报告',
		color: '#f59e0b',
	},
];
