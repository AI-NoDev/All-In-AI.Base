import type { Node } from '@xyflow/svelte';
import type { VariableType, NodeRunData } from '$lib/components/workflow/types/workflow';

/** 开始节点默认 ID */
export const START_NODE_ID = 'start';

/**
 * 输入字段 UI 类型 - 决定表单渲染方式
 * 与 VariableType 分离，一个 VariableType 可以有多种 UI 表现
 */
export type InputFieldUIType =
	| 'text'           // 单行文本输入
	| 'textarea'       // 多行文本输入
	| 'number'         // 数字输入
	| 'select'         // 下拉选择
	| 'checkbox'       // 复选框
	| 'file'           // 单文件上传
	| 'files'          // 多文件上传
	| 'json';          // JSON 编辑器

/**
 * UI 类型到数据类型的映射
 */
export const UI_TYPE_TO_VARIABLE_TYPE: Record<InputFieldUIType, VariableType> = {
	text: 'string',
	textarea: 'string',
	number: 'number',
	select: 'string',
	checkbox: 'boolean',
	file: 'file',
	files: 'file-list',
	json: 'object',
};

/**
 * UI 类型配置
 */
export const UI_TYPE_CONFIG: Record<InputFieldUIType, {
	label: string;
	icon: string;
	dataType: VariableType;
}> = {
	text: { label: '文本', icon: 'mdi:format-text', dataType: 'string' },
	textarea: { label: '段落', icon: 'mdi:text-long', dataType: 'string' },
	number: { label: '数字', icon: 'mdi:numeric', dataType: 'number' },
	select: { label: '下拉选项', icon: 'mdi:form-dropdown', dataType: 'string' },
	checkbox: { label: '复选框', icon: 'mdi:checkbox-marked-outline', dataType: 'boolean' },
	file: { label: '单文件', icon: 'mdi:file-outline', dataType: 'file' },
	files: { label: '文件列表', icon: 'mdi:file-multiple-outline', dataType: 'file-list' },
	json: { label: 'JSON', icon: 'mdi:code-json', dataType: 'object' },
};

/**
 * 下拉选项
 */
export interface SelectOption {
	value: string;
	label: string;
}

/**
 * 文件类型限制配置
 */
export interface FileTypeConfig {
	/** 允许的 MIME 类型，如 ['image/*', 'application/pdf'] */
	mimeTypes?: string[];
	/** 允许的扩展名，如 ['.pdf', '.docx'] */
	extensions?: string[];
}

/**
 * 输入字段定义 - 统一的字段配置
 */
export interface InputField {
	/** 字段唯一标识 */
	id: string;
	
	/** 变量名（用于引用，如 input_name） */
	variable: string;
	
	/** 显示名称 */
	label: string;
	
	/** 数据类型 */
	type: VariableType;
	
	/** UI 渲染类型 */
	uiType: InputFieldUIType;
	
	/** 字段描述/帮助文本 */
	description?: string;
	
	/** 是否必填 */
	required: boolean;
	
	/** 是否隐藏（隐藏字段不在表单中显示，但可以有默认值） */
	hidden?: boolean;
	
	/** 是否为系统内置字段（不可删除） */
	builtin?: boolean;
	
	/** 占位符文本 */
	placeholder?: string;
	
	/** 默认值 */
	defaultValue?: string | number | boolean | object;
	
	// ===== 类型特定配置 =====
	
	/** 最大长度（text/textarea） */
	maxLength?: number;
	
	/** 最小值（number） */
	min?: number;
	
	/** 最大值（number） */
	max?: number;
	
	/** 步进值（number） */
	step?: number;
	
	/** 选项列表（select） */
	options?: SelectOption[];
	
	/** 文件类型限制（file/files） */
	fileConfig?: FileTypeConfig;
	
	/** 最大文件数量（files） */
	maxFiles?: number;
	
	/** JSON Schema（json 类型，用于验证和编辑器提示） */
	jsonSchema?: object;
}

/**
 * 创建默认输入字段
 */
export function createInputField(partial: Partial<InputField> & { variable: string; label: string }): InputField {
	const uiType = partial.uiType ?? 'text';
	return {
		id: partial.id ?? crypto.randomUUID(),
		variable: partial.variable,
		label: partial.label,
		type: partial.type ?? UI_TYPE_TO_VARIABLE_TYPE[uiType],
		uiType,
		required: partial.required ?? false,
		hidden: partial.hidden ?? false,
		builtin: partial.builtin ?? false,
		description: partial.description,
		placeholder: partial.placeholder,
		defaultValue: partial.defaultValue,
		maxLength: partial.maxLength,
		min: partial.min,
		max: partial.max,
		step: partial.step,
		options: partial.options,
		fileConfig: partial.fileConfig,
		maxFiles: partial.maxFiles,
		jsonSchema: partial.jsonSchema,
	};
}

/**
 * 内置的系统输入字段
 */
export const BUILTIN_FIELDS: InputField[] = [
	createInputField({
		id: 'sys.user_files',
		variable: 'sys.user_files',
		label: '用户文件',
		type: 'file-list',
		uiType: 'files',
		required: false,
		builtin: true,
		description: '用户上传的文件列表',
	}),
];

/**
 * 开始节点数据
 */
export interface StartNodeData extends Record<string, unknown> {
	/** 节点标题 */
	title: string;
	
	/** 节点类型标识 */
	type: 'start';
	
	/** 节点描述 */
	desc?: string;
	
	/** 用户定义的输入字段列表 */
	inputs?: InputField[];
	
	/** 运行时数据 */
	_run?: NodeRunData;
}

/**
 * 开始节点类型
 */
export type StartNode = Node<StartNodeData, 'start'>;

/**
 * 获取所有输入字段（内置 + 用户定义）
 */
export function getAllInputFields(data: StartNodeData): InputField[] {
	return [...BUILTIN_FIELDS, ...(data.inputs ?? [])];
}

/**
 * 获取可见的输入字段（排除隐藏字段）
 */
export function getVisibleInputFields(data: StartNodeData): InputField[] {
	return getAllInputFields(data).filter(f => !f.hidden);
}

/**
 * 生成唯一变量名
 */
export function generateUniqueVariable(existingFields: InputField[], prefix = 'input'): string {
	const existingVars = new Set(existingFields.map(f => f.variable));
	let index = 1;
	while (existingVars.has(`${prefix}_${index}`)) {
		index++;
	}
	return `${prefix}_${index}`;
}

/**
 * 验证变量名格式
 */
export function isValidVariableName(name: string): boolean {
	// 变量名必须以字母或下划线开头，只能包含字母、数字、下划线
	return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

/**
 * 检查变量名是否已存在
 */
export function isVariableNameTaken(name: string, existingFields: InputField[], excludeId?: string): boolean {
	return existingFields.some(f => f.variable === name && f.id !== excludeId);
}
