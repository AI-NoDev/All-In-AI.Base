import type { Node } from '@xyflow/svelte';
import type { Condition, ComparisonOperator } from '../IfNode/types.js';

/** 运行状态 */
export type RunStatus = 'idle' | 'running' | 'success' | 'failed';

/** 循环变量 */
export interface LoopVariable {
	id: string;
	/** 变量名 */
	name: string;
	/** 初始值 */
	initialValue: string;
	/** 变量类型 */
	type: 'String' | 'Number' | 'Boolean' | 'Array' | 'Object';
}

/** 循环终止条件 */
export interface LoopBreakCondition {
	id: string;
	/** 变量路径 */
	variable: string;
	/** 比较操作符 */
	operator: ComparisonOperator;
	/** 比较值 */
	value: string;
}

/** 运行结果数据 */
export interface LoopRunResult {
	status: RunStatus;
	startedAt?: string;
	endedAt?: string;
	duration?: number;
	/** 实际循环次数 */
	iterations?: number;
	/** 终止原因 */
	breakReason?: 'condition' | 'maxIterations' | 'error';
	inputs?: Record<string, unknown>;
	outputs?: Record<string, unknown>;
	error?: string;
}

/** 循环节点数据 */
export interface LoopNodeData extends Record<string, unknown> {
	title: string;
	type: 'loop';
	desc?: string;
	
	/** 循环变量列表 */
	variables: LoopVariable[];
	
	/** 循环终止条件 */
	breakConditions: LoopBreakCondition[];
	
	/** 最大循环次数 */
	maxIterations: number;
	
	/** 上次运行结果 */
	lastRun?: LoopRunResult;
}

/** 循环节点类型 */
export type LoopNode = Node<LoopNodeData, 'loop'>;

/** 创建默认循环变量 */
export function createDefaultLoopVariable(): LoopVariable {
	return {
		id: crypto.randomUUID(),
		name: '',
		initialValue: '',
		type: 'String'
	};
}

/** 创建默认终止条件 */
export function createDefaultBreakCondition(): LoopBreakCondition {
	return {
		id: crypto.randomUUID(),
		variable: '',
		operator: 'equals',
		value: ''
	};
}

/** 变量类型选项 */
export const VARIABLE_TYPES: { value: LoopVariable['type']; label: string }[] = [
	{ value: 'String', label: '字符串' },
	{ value: 'Number', label: '数字' },
	{ value: 'Boolean', label: '布尔' },
	{ value: 'Array', label: '数组' },
	{ value: 'Object', label: '对象' },
];
