import type { Node } from '@xyflow/svelte';

/** 运行状态 */
export type RunStatus = 'idle' | 'running' | 'success' | 'failed';

/** 知识库引用 */
export interface KnowledgeBaseRef {
	/** 知识库 ID */
	id: string;
	/** 知识库名称 */
	name: string;
	/** 召回数量 */
	topK?: number;
	/** 相似度阈值 */
	scoreThreshold?: number;
}

/** 元数据过滤模式 */
export type MetadataFilterMode = 'disabled' | 'auto' | 'manual';

/** 元数据过滤条件 */
export interface MetadataFilter {
	/** 字段名 */
	field: string;
	/** 操作符 */
	operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
	/** 值 */
	value: string | number | boolean | string[];
}

/** 输出变量定义 */
export interface OutputVariable {
	/** 变量名 */
	name: string;
	/** 变量类型 */
	type: string;
	/** 描述 */
	description: string;
	/** 子字段（用于 object 类型） */
	children?: OutputVariable[];
}

/** 内置输出变量 */
export const BUILTIN_OUTPUT_VARIABLES: OutputVariable[] = [
	{
		name: 'result',
		type: 'Array[Object]',
		description: '召回的分段',
		children: [
			{ name: 'content', type: 'string', description: '分段内容' },
			{ name: 'title', type: 'string', description: '分段标题' },
			{ name: 'url', type: 'string', description: '分段链接' },
			{ name: 'icon', type: 'string', description: '分段图标' },
			{ name: 'metadata', type: 'object', description: '其他元数据' },
		],
	},
	{ name: 'files', type: 'Array[File]', description: '召回的文件' },
];

/** 元数据过滤模式选项 */
export const METADATA_FILTER_OPTIONS: { value: MetadataFilterMode; label: string; description: string }[] = [
	{ value: 'disabled', label: '禁用', description: '禁用元数据过滤' },
	{ value: 'auto', label: '自动', description: '根据用户查询自动生成元数据过滤条件' },
	{ value: 'manual', label: '手动', description: '手动添加元数据过滤条件' },
];

/** 运行结果数据 */
export interface KnowledgeRunResult {
	/** 运行状态 */
	status: RunStatus;
	/** 开始时间 */
	startedAt?: string;
	/** 结束时间 */
	endedAt?: string;
	/** 运行时长（毫秒） */
	duration?: number;
	/** 召回数量 */
	resultCount?: number;
	/** 输入 */
	inputs?: Record<string, unknown>;
	/** 输出结果 */
	outputs?: Record<string, unknown>;
	/** 错误信息 */
	error?: string;
}

/** 知识检索节点数据 */
export interface KnowledgeNodeData extends Record<string, unknown> {
	title: string;
	type: 'knowledge';
	desc?: string;
	
	/** 查询文本变量路径 */
	queryVariable?: string;
	
	/** 知识库列表 */
	knowledgeBases?: KnowledgeBaseRef[];
	
	/** 默认召回数量 */
	topK?: number;
	
	/** 默认相似度阈值 */
	scoreThreshold?: number;
	
	/** 元数据过滤模式 */
	metadataFilterMode?: MetadataFilterMode;
	
	/** 手动元数据过滤条件 */
	metadataFilters?: MetadataFilter[];
	
	/** 上次运行结果 */
	lastRun?: KnowledgeRunResult;
}

/** 知识检索节点类型 */
export type KnowledgeNode = Node<KnowledgeNodeData, 'knowledge'>;

/** 模拟知识库列表（实际应从 API 获取） */
export const MOCK_KNOWLEDGE_BASES: { id: string; name: string; icon?: string }[] = [
	{ id: 'kb-1', name: '产品文档', icon: 'mdi:file-document' },
	{ id: 'kb-2', name: '技术手册', icon: 'mdi:book-open-variant' },
	{ id: 'kb-3', name: 'FAQ 知识库', icon: 'mdi:frequently-asked-questions' },
	{ id: 'kb-4', name: '客服话术', icon: 'mdi:message-text' },
];
