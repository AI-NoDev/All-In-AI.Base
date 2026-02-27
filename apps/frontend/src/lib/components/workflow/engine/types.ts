/**
 * 工作流执行引擎类型定义
 */
import type { WorkflowNode, WorkflowEdge, BaseNodeData, NodeRunStatus, Variable, EnvironmentVariable } from '$lib/components/workflow/types/index';

/** 执行事件类型 */
export type ExecutionEventType = 
	| 'workflow:start'
	| 'workflow:complete'
	| 'workflow:error'
	| 'node:start'
	| 'node:complete'
	| 'node:error'
	| 'node:skip';

/** 执行事件 */
export interface ExecutionEvent {
	type: ExecutionEventType;
	nodeId?: string;
	nodeType?: string;
	data?: unknown;
	error?: string;
	timestamp: number;
}

/** 执行上下文 - 存储运行时变量 */
export interface ExecutionContext {
	/** 工作流 ID */
	workflowId: string;
	/** 执行 ID（每次运行唯一） */
	executionId: string;
	/** 是否为测试模式 */
	isTest: boolean;
	/** 节点输出变量存储 */
	variables: Map<string, Record<string, unknown>>;
	/** 环境变量 */
	environmentVariables: Record<string, string>;
	/** 系统变量 */
	systemVariables: Record<string, unknown>;
	/** 用户输入（开始节点的输入） */
	userInputs: Record<string, unknown>;
	/** 用户上传的文件列表 */
	userFiles?: File[];
	/** 当前循环上下文（如果在循环内） */
	loopContext?: {
		loopId: string;
		index: number;
		item: unknown;
		items: unknown[];
	};
}

/** 节点执行器 - 由外部实现具体节点逻辑 */
export interface NodeExecutor {
	/** 执行节点 */
	execute(
		node: WorkflowNode<BaseNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>>;
}

/** 执行选项 */
export interface ExecutionOptions {
	/** 是否为测试模式 */
	isTest?: boolean;
	/** 用户输入 */
	userInputs?: Record<string, unknown>;
	/** 用户上传的文件列表 */
	userFiles?: File[];
	/** 环境变量 */
	environmentVariables?: Record<string, string>;
	/** 系统变量 */
	systemVariables?: Record<string, unknown>;
	/** 从指定节点开始执行（用于单节点测试） */
	startFromNodeId?: string;
	/** 最大执行时间（毫秒） */
	timeout?: number;
	/** 事件回调 */
	onEvent?: (event: ExecutionEvent) => void;
}

/** 节点执行结果 */
export interface NodeExecutionResult {
	nodeId: string;
	nodeType: string;
	status: NodeRunStatus;
	inputs?: Record<string, unknown>;
	outputs?: Record<string, unknown>;
	error?: string;
	startTime: number;
	endTime: number;
	elapsed: number;
	tokens?: {
		prompt: number;
		completion: number;
		total: number;
	};
}

/** 工作流执行结果 */
export interface ExecutionResult {
	/** 执行 ID */
	executionId: string;
	/** 执行状态 */
	status: 'success' | 'error' | 'cancelled';
	/** 开始时间 */
	startTime: number;
	/** 结束时间 */
	endTime: number;
	/** 总耗时 */
	elapsed: number;
	/** 各节点执行结果 */
	nodeResults: NodeExecutionResult[];
	/** 最终输出（Output 节点的输出） */
	outputs?: Record<string, unknown>;
	/** 错误信息 */
	error?: string;
	/** Token 使用统计 */
	totalTokens?: {
		prompt: number;
		completion: number;
		total: number;
	};
}

/** 节点执行器注册表 */
export type NodeExecutorRegistry = Map<string, NodeExecutor>;
