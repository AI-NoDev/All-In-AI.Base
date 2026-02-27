import type { Node } from '@xyflow/svelte';
import type { VariableType } from '$lib/components/workflow/types/workflow';

/** 工具调用步骤 */
export interface ToolCallStep {
	/** 调用 ID */
	id: string;
	/** 工具名称 */
	name: string;
	/** 调用参数 */
	args: Record<string, unknown>;
	/** 调用状态 */
	status: 'pending' | 'running' | 'success' | 'error';
	/** 调用结果 */
	result?: unknown;
	/** 错误信息 */
	error?: string;
	/** 开始时间 */
	startTime?: number;
	/** 结束时间 */
	endTime?: number;
}

/** 节点输出变量定义 */
export interface NodeOutputVariable {
	/** 变量路径（相对于节点，如 output, structured_output） */
	path: string;
	/** 显示名称 */
	label: string;
	/** 数据类型 */
	type: VariableType;
	/** 描述 */
	description?: string;
}

/** Agent 节点默认输出变量 */
export const AGENT_DEFAULT_OUTPUTS: NodeOutputVariable[] = [
	{ path: 'text', label: '生成内容', type: 'string', description: 'Agent 生成的内容' },
	{ path: 'usage', label: '用量信息', type: 'object', description: '模型用量信息' },
	{ path: 'files', label: '文件列表', type: 'file-list', description: 'Agent 生成的文件' },
	{ path: 'json', label: 'JSON 数据', type: 'array-object', description: 'Agent 生成的 JSON' },
];

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
	{ name: 'text', type: 'string', description: 'Agent 生成的内容' },
	{ name: 'usage', type: 'object', description: '模型用量信息' },
	{ name: 'files', type: 'Array<File>', description: 'Agent 生成的文件' },
	{ name: 'json', type: 'Array<Object>', description: 'Agent 生成的 JSON' },
];

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
	/** 选中的 MCP 服务器 ID 列表 */
	mcpServerIds?: string[];
	/** 指令提示词 */
	instructionPrompt?: string;
	/** 最大步骤数 */
	maxSteps?: number;
}

/** Agent节点类型 */
export type AgentNode = Node<AgentNodeData, 'agent'>;
