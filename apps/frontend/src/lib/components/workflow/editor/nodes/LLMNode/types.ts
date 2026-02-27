import type { Node } from '@xyflow/svelte';
import type { RootSchema } from './schema-types';
import type { VariableType } from '$lib/components/workflow/types/workflow';

/** 运行状态 */
export type RunStatus = 'idle' | 'running' | 'success' | 'failed';

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
	/** 是否支持图片输入 */
	supportImageInput?: boolean;
	/** 是否支持视频输入 */
	supportVideoInput?: boolean;
}

/** 上下文变量引用 */
export interface ContextVariable {
	/** 变量路径，如 start.input_1 */
	path: string;
	/** 变量显示名称 */
	displayName?: string;
}

/** 节点输出变量定义 */
export interface NodeOutputVariable {
	/** 变量路径（相对于节点，如 text, usage.total_tokens） */
	path: string;
	/** 显示名称 */
	label: string;
	/** 数据类型 */
	type: VariableType;
	/** 描述 */
	description?: string;
}

/** 内置输出变量 */
export interface BuiltinOutputVariable {
	/** 变量名 */
	name: string;
	/** 变量类型 */
	type: string;
	/** 描述 */
	description: string;
}

/** LLM 节点默认输出变量 */
export const LLM_DEFAULT_OUTPUTS: NodeOutputVariable[] = [
	{ path: 'text', label: '生成内容', type: 'string', description: 'LLM 生成的文本内容' },
	{ path: 'reasoning_content', label: '推理内容', type: 'string', description: '模型的推理过程（如果启用）' },
	{ path: 'usage', label: '用量信息', type: 'object', description: '模型 token 用量统计' },
];

/** LLM 节点异常输出变量 */
export const LLM_ERROR_OUTPUTS: NodeOutputVariable[] = [
	{ path: 'error_message', label: '异常信息', type: 'string', description: '异常错误消息' },
];

/** 内置输出变量列表 */
export const BUILTIN_OUTPUT_VARIABLES: BuiltinOutputVariable[] = [
	{ name: 'text', type: 'string', description: '生成内容' },
	{ name: 'reasoning_content', type: 'string', description: '推理内容' },
	{ name: 'usage', type: 'object', description: '模型用量信息' },
];

/** 异常处理方式 */
export type ExceptionHandling = 'none' | 'default_value' | 'fail_branch';

/** 提示词消息角色 */
export type PromptRole = 'system' | 'user' | 'assistant';

/** 提示词消息 */
export interface PromptMessage {
	/** 消息ID */
	id: string;
	/** 角色 */
	role: PromptRole;
	/** 内容 */
	content: string;
}

/** 运行结果数据 */
export interface LLMRunResult {
	/** 运行状态 */
	status: RunStatus;
	/** 开始时间 */
	startedAt?: string;
	/** 结束时间 */
	endedAt?: string;
	/** 运行时长（毫秒） */
	duration?: number;
	/** 消耗的 token 数 */
	tokenUsage?: {
		prompt: number;
		completion: number;
		total: number;
	};
	/** 输入上下文 */
	inputs?: Record<string, unknown>;
	/** 输出结果 */
	outputs?: Record<string, unknown>;
	/** 错误信息 */
	error?: string;
}

/** LLM 节点数据 */
export interface LLMNodeData extends Record<string, unknown> {
	title: string;
	type: 'llm';
	desc?: string;
	
	/** 模型配置 */
	modelConfig?: ModelConfig;
	
	/** 上下文变量列表 */
	context?: ContextVariable[];
	
	/** 输出变量定义（供后续节点引用） */
	outputs?: NodeOutputVariable[];
	
	/** 异常输出变量定义（异常分支使用） */
	errorOutputs?: NodeOutputVariable[];
	
	/** 是否启用视觉（图像输入） */
	visionEnabled?: boolean;
	
	/** 是否启用推理标签分离（thinking tags） */
	reasoningTagsEnabled?: boolean;
	
	/** 是否启用结构化输出 */
	structuredOutput?: boolean;
	
	/** 结构化输出 Schema（使用 zod-visual-editor 的 RootSchema） */
	outputSchema?: RootSchema;
	
	/** 是否启用失败重试 */
	retryOnFailure?: boolean;
	
	/** 最大重试次数 */
	retryCount?: number;
	
	/** 重试间隔（毫秒） */
	retryInterval?: number;
	
	/** 异常处理方式 */
	exceptionHandling?: ExceptionHandling;
	
	/** 异常时的默认值 */
	defaultValue?: string;
	
	/** 提示词消息列表（第一个固定为 system，后续为 user/assistant） */
	promptMessages?: PromptMessage[];
	
	/** @deprecated 使用 promptMessages 代替 */
	systemPrompt?: string;
	
	/** @deprecated 使用 promptMessages 代替 */
	userPromptTemplate?: string;
	
	/** 温度 */
	temperature?: number;
	
	/** 最大 token 数 */
	maxTokens?: number;
	
	/** Top P */
	topP?: number;
	
	/** 上次运行结果 */
	lastRun?: LLMRunResult;
}

/** LLM 节点类型 */
export type LLMNode = Node<LLMNodeData, 'llm'>;

/** 异常处理选项 */
export const EXCEPTION_HANDLING_OPTIONS: { value: ExceptionHandling; label: string; description: string }[] = [
	{ value: 'none', label: '无', description: '当发生异常且未处理时，节点将停止运行' },
	{ value: 'default_value', label: '默认值', description: '当发生异常时，指定默认输出内容。' },
	{ value: 'fail_branch', label: '异常分支', description: '当发生异常时，将执行异常分支' },
];
