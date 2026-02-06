import type { Node } from '@xyflow/svelte';

/** 开始节点默认 ID */
export const START_NODE_ID = 'start';

/** 输入字段类型 */
export type InputFieldType = 
	| 'text'           // 短文本
	| 'paragraph'      // 长文本/段落
	| 'number'         // 数字
	| 'select'         // 单选下拉
	| 'file'           // 单文件
	| 'files';         // 多文件

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
	/** 是否必填 */
	required: boolean;
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

/** 开始节点数据 */
export interface StartNodeData extends Record<string, unknown> {
	title: string;
	type: 'start';
	desc?: string;
	/** 输入字段列表 */
	inputs?: InputField[];
}

/** 开始节点类型 */
export type StartNode = Node<StartNodeData, 'start'>;
