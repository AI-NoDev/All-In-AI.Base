import type { Node } from '@xyflow/svelte';

/** 运行状态 */
export type RunStatus = 'idle' | 'running' | 'success' | 'failed';

/** 模型配置 */
export interface ModelConfig {
	/** 模型提供商 */
	provider: string;
	/** 模型名称 */
	model: string;
	/** 模型显示名称 */
	displayName?: string;
}

/** 分类选项 */
export interface ClassifierOption {
	id: string;
	label: string;
	description?: string;
}

/** 内置输出变量 */
export interface BuiltinOutputVariable {
	name: string;
	type: string;
	description: string;
}

/** 内置输出变量列表 */
export const BUILTIN_OUTPUT_VARIABLES: BuiltinOutputVariable[] = [
	{ name: 'class_name', type: 'string', description: '分类名称' },
	{ name: 'usage', type: 'object', description: '模型用量信息' },
];

/** 运行结果数据 */
export interface ClassifierRunResult {
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

/** 问题分类器节点数据 */
export interface ClassifierNodeData extends Record<string, unknown> {
	title: string;
	type: 'classifier';
	desc?: string;
	
	/** 模型配置 */
	modelConfig?: ModelConfig;
	
	/** 输入变量路径 */
	inputVariable?: string;
	
	/** 是否启用视觉（图像输入） */
	visionEnabled?: boolean;
	
	/** 分类选项 */
	options?: ClassifierOption[];
	
	/** 高级设置：指令/系统提示词 */
	instruction?: string;
	
	/** 上次运行结果 */
	lastRun?: ClassifierRunResult;
}

/** 问题分类器节点类型 */
export type ClassifierNode = Node<ClassifierNodeData, 'classifier'>;
