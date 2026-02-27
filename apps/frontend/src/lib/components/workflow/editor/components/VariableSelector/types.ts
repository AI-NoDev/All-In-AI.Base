import type { VariableType } from '$lib/components/workflow/types/workflow';

/** 变量数据类型（兼容旧格式的显示名称） */
export type VariableDataType = VariableType;

/** VariableType 到显示名称的映射 */
export const VARIABLE_TYPE_LABELS: Record<VariableType, string> = {
	'string': 'String',
	'number': 'Number',
	'boolean': 'Boolean',
	'object': 'Object',
	'array-string': 'Array<String>',
	'array-number': 'Array<Number>',
	'array-object': 'Array<Object>',
	'file': 'File',
	'file-list': 'Array<File>',
};

/** 变量来源类型 */
export type VariableSource = 'input' | 'node' | 'sys' | 'env' | 'loop';

/** 变量定义 */
export interface Variable {
	/** 变量路径，如 input.query 或 sys.user_id 或 llm_1.text */
	path: string;
	/** 显示名称 */
	label: string;
	/** 数据类型 */
	type: VariableType;
	/** 描述 */
	description?: string;
	/** 变量来源 */
	source?: VariableSource;
}

/** 变量分组 */
export interface VariableGroup {
	/** 分组 ID */
	id: string;
	/** 分组名称 */
	label: string;
	/** 分组图标 */
	icon: string;
	/** 变量列表 */
	variables: Variable[];
}

/** 系统变量定义 */
export const SYSTEM_VARIABLES: Variable[] = [
	{ path: 'sys.user_id', label: '用户 ID', type: 'string', description: '当前执行用户的唯一标识', source: 'sys' },
	{ path: 'sys.workflow_id', label: '工作流 ID', type: 'string', description: '当前工作流的唯一标识', source: 'sys' },
	{ path: 'sys.workflow_run_id', label: '工作流运行 ID', type: 'string', description: '本次运行的唯一标识', source: 'sys' },
	{ path: 'sys.timestamp', label: '时间戳', type: 'number', description: '应用开始运行的时间戳（毫秒）', source: 'sys' },
];

/** 环境变量（示例，实际应从配置获取） */
export const DEFAULT_ENV_VARIABLES: Variable[] = [
	{ path: 'env.API_KEY', label: 'API_KEY', type: 'string', description: 'API 密钥', source: 'env' },
	{ path: 'env.BASE_URL', label: 'BASE_URL', type: 'string', description: '基础 URL', source: 'env' },
];

/**
 * 将开始节点的输入字段转换为流程输入变量
 * 使用 input.xxx 格式，而不是 start.xxx
 */
export function createInputVariable(variable: string, label: string, type: VariableType, description?: string): Variable {
	return {
		path: `input.${variable}`,
		label,
		type,
		description,
		source: 'input',
	};
}

/**
 * 将节点输出转换为变量
 */
export function createNodeOutputVariable(nodeId: string, outputPath: string, label: string, type: VariableType, description?: string): Variable {
	return {
		path: `${nodeId}.${outputPath}`,
		label,
		type,
		description,
		source: 'node',
	};
}
