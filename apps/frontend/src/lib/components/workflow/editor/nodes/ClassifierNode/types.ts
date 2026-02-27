import type { Node } from '@xyflow/svelte';
import type { VariableType } from '$lib/components/workflow/types/workflow';

/** 节点输出变量定义 */
export interface NodeOutputVariable {
	/** 变量路径（相对于节点，如 class_name, usage） */
	path: string;
	/** 显示名称 */
	label: string;
	/** 数据类型 */
	type: VariableType;
	/** 描述 */
	description?: string;
}

/** 分类器节点默认输出变量 */
export const CLASSIFIER_DEFAULT_OUTPUTS: NodeOutputVariable[] = [
	{ path: 'target', label: '分类ID', type: 'string', description: '选中分类的 ID（用于条件分支）' },
	{ path: 'class_name', label: '分类名称', type: 'string', description: '分类结果的名称' },
	{ path: 'usage', label: '用量信息', type: 'object', description: '模型 token 用量统计' },
];

/** 模型配置 */
export interface ModelConfig {
	/** 模型 UUID */
	id: string;
	/** 模型提供商 UUID */
	provider: string;
	/** 模型标识 (如 deepseek-chat) */
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
	{ name: 'target', type: 'string', description: '分类 ID（用于条件分支）' },
	{ name: 'class_name', type: 'string', description: '分类名称' },
	{ name: 'usage', type: 'object', description: '模型用量信息' },
];

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
}

/** 问题分类器节点类型 */
export type ClassifierNode = Node<ClassifierNodeData, 'classifier'>;
