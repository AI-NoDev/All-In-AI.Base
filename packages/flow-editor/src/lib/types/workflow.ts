import type { Node, Edge } from '@xyflow/svelte';

/**
 * 变量类型枚举
 */
export type VariableType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'object'
	| 'array-string'
	| 'array-number'
	| 'array-object'
	| 'file'
	| 'file-list';

/**
 * 变量值类型
 */
export type VariableValue = string | number | boolean | object | string[] | number[] | object[];

/**
 * 变量定义 - 对应 Dify DSL 中的 variable
 */
export interface Variable {
	/** 变量唯一标识 */
	id: string;
	/** 变量名称 */
	name: string;
	/** 变量类型 */
	type: VariableType;
	/** 变量描述 */
	description?: string;
	/** 默认值 */
	default?: VariableValue;
	/** 是否必填 */
	required?: boolean;
	/** 最大长度（string 类型） */
	max_length?: number;
	/** 选项列表（用于下拉选择） */
	options?: string[];
}

/**
 * 环境变量定义
 */
export interface EnvironmentVariable {
	id: string;
	name: string;
	value: string;
	value_type: 'string' | 'secret';
}

/**
 * 会话变量定义 - 对应 Dify DSL 中的 conversation_variables
 */
export interface ConversationVariable extends Variable {
	/** 变量选择器路径 */
	selector?: string[];
}

/**
 * 节点数据基础类型
 */
export interface BaseNodeData extends Record<string, unknown> {
	/** 节点标题 */
	title: string;
	/** 节点描述 */
	desc?: string;
	/** 节点类型 */
	type: string;
}

/**
 * 工作流节点类型 - 扩展 xyflow 的 Node
 */
export type WorkflowNode<T extends BaseNodeData = BaseNodeData> = Node<T>;

/**
 * 工作流边数据
 */
export interface WorkflowEdgeData extends Record<string, unknown> {
	/** 条件表达式（用于条件分支） */
	condition?: string;
	/** 边标签 */
	label?: string;
}

/**
 * 工作流边类型 - 扩展 xyflow 的 Edge
 */
export type WorkflowEdge = Edge<WorkflowEdgeData>;

/**
 * 工作流特性配置 - 对应 Dify DSL 中的 features
 */
export interface WorkflowFeatures {
	/** 文件上传配置 */
	file_upload?: {
		enabled: boolean;
		allowed_file_types?: string[];
		allowed_file_extensions?: string[];
		max_length?: number;
		image?: {
			enabled: boolean;
			number_limits?: number;
			transfer_methods?: ('local_file' | 'remote_url')[];
		};
	};
	/** 开场白配置 */
	opening_statement?: string;
	/** 建议问题 */
	suggested_questions?: string[];
	/** 引用和归属 */
	retriever_resource?: {
		enabled: boolean;
	};
	/** 敏感词过滤 */
	sensitive_word_avoidance?: {
		enabled: boolean;
		type?: string;
		config?: Record<string, unknown>;
	};
	/** 语音转文字 */
	speech_to_text?: {
		enabled: boolean;
	};
	/** 文字转语音 */
	text_to_speech?: {
		enabled: boolean;
		voice?: string;
		language?: string;
	};
}

/**
 * 工作流元数据
 */
export interface WorkflowMetadata {
	/** 工作流名称 */
	name: string;
	/** 工作流描述 */
	description?: string;
	/** 工作流图标 */
	icon?: string;
	/** 工作流图标背景色 */
	icon_background?: string;
	/** 创建时间 */
	created_at?: string;
	/** 更新时间 */
	updated_at?: string;
	/** 版本号 */
	version?: string;
}
