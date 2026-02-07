import type { Node } from '@xyflow/svelte';

/** 开始节点默认 ID */
export const START_NODE_ID = 'start';

/** 输入字段类型 */
export type InputFieldType = 
	| 'text'           // 短文本 -> String
	| 'paragraph'      // 长文本/段落 -> String
	| 'select'         // 单选下拉 -> String
	| 'number'         // 数字 -> Number
	| 'checkbox'       // 复选框 -> Boolean
	| 'file'           // 单文件 -> File
	| 'files'          // 文件列表 -> Array<File>
	| 'json';          // JSON -> Object

/** 字段类型对应的数据类型 */
export const FIELD_TYPE_DATA_TYPES: Record<InputFieldType, string> = {
	text: 'String',
	paragraph: 'String',
	select: 'String',
	number: 'Number',
	checkbox: 'Boolean',
	file: 'File',
	files: 'Array<File>',
	json: 'Object',
};

/** 选项（用于 select 类型） */
export interface SelectOption {
	value: string;
	label: string;
}

/** 输入字段定义 */
export interface InputField {
	/** 字段唯一标识（变量名） */
	id: string;
	/** 字段类型 */
	type: InputFieldType;
	/** 显示名称 */
	label: string;
	/** 变量名（用于引用） */
	variable: string;
	/** 是否必填（与 hidden 互斥） */
	required: boolean;
	/** 是否隐藏（与 required 互斥） */
	hidden?: boolean;
	/** 是否为系统内置字段（不可删除/编辑） */
	builtin?: boolean;
	/** 占位符文本 */
	placeholder?: string;
	/** 默认值 */
	defaultValue?: string | number;
	/** 最大长度（text/paragraph） */
	maxLength?: number;
	/** 选项列表（select 类型） */
	options?: SelectOption[];
	/** 允许的文件类型（file/files 类型） */
	allowedFileTypes?: string[];
	/** 最大文件数量（files 类型） */
	maxFiles?: number;
}

/** 内置的用户文件输入字段 */
export const BUILTIN_USER_FILES_FIELD: InputField = {
	id: 'userinput.files',
	type: 'files',
	label: '用户文件',
	variable: 'userinput.files',
	required: false,
	hidden: false,
	builtin: true,
};

/** 运行状态 */
export type RunStatus = 'idle' | 'running' | 'success' | 'failed';

/** 字段输入值 */
export interface FieldInputValue {
	fieldId: string;
	variable: string;
	value: string | number | File | File[];
}

/** 运行结果数据 */
export interface RunResult {
	/** 运行状态 */
	status: RunStatus;
	/** 开始时间 */
	startedAt?: string;
	/** 结束时间 */
	endedAt?: string;
	/** 运行时长（毫秒） */
	duration?: number;
	/** 消耗的 token 数 */
	tokenUsage?: number;
	/** 输入参数值 */
	inputs?: FieldInputValue[];
	/** 输出结果 */
	outputs?: Record<string, unknown>;
	/** 错误信息 */
	error?: string;
}

/** 开始节点数据 */
export interface StartNodeData extends Record<string, unknown> {
	title: string;
	type: 'start';
	desc?: string;
	/** 输入字段列表 */
	inputs?: InputField[];
	/** 上次运行结果 */
	lastRun?: RunResult;
}

/** 开始节点类型 */
export type StartNode = Node<StartNodeData, 'start'>;
