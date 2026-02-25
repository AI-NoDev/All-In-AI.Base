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

/** 变量定义 */
export interface Variable {
	/** 变量路径，如 start.input_1 或 sys.user_id */
	path: string;
	/** 显示名称 */
	label: string;
	/** 数据类型 */
	type: VariableType;
	/** 描述 */
	description?: string;
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
	{ path: 'sys.user_id', label: '用户 ID', type: 'string', description: '当前执行用户的唯一标识' },
	{ path: 'sys.workflow_id', label: '工作流 ID', type: 'string', description: '当前工作流的唯一标识' },
	{ path: 'sys.workflow_run_id', label: '工作流运行 ID', type: 'string', description: '本次运行的唯一标识' },
	{ path: 'sys.timestamp', label: '时间戳', type: 'number', description: '应用开始运行的时间戳（毫秒）' },
];

/** 环境变量（示例，实际应从配置获取） */
export const DEFAULT_ENV_VARIABLES: Variable[] = [
	{ path: 'env.API_KEY', label: 'API_KEY', type: 'string', description: 'API 密钥' },
	{ path: 'env.BASE_URL', label: 'BASE_URL', type: 'string', description: '基础 URL' },
];
