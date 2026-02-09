import type { Node } from '@xyflow/svelte';

/** 运行状态 */
export type RunStatus = 'idle' | 'running' | 'success' | 'failed';

/** 比较操作符 */
export type ComparisonOperator = 
	| 'contains'      // 包含
	| 'not_contains'  // 不包含
	| 'starts_with'   // 开头是
	| 'ends_with'     // 结尾是
	| 'equals'        // 是
	| 'not_equals'    // 不是
	| 'is_empty'      // 为空
	| 'is_not_empty'; // 不为空

/** 逻辑操作符 */
export type LogicalOperator = 'and' | 'or';

/** 单个条件 */
export interface Condition {
	id: string;
	/** 变量路径，如 {{#start.input_1#}} */
	variable: string;
	/** 比较操作符 */
	operator: ComparisonOperator;
	/** 比较值 */
	value: string;
}

/** 条件分支（IF/ELIF） */
export interface ConditionCase {
	id: string;
	/** 分支类型 */
	type: 'if' | 'elif';
	/** 条件列表 */
	conditions: Condition[];
	/** 条件之间的逻辑关系 */
	logicalOperator: LogicalOperator;
}

/** 运行结果数据 */
export interface IfRunResult {
	status: RunStatus;
	startedAt?: string;
	endedAt?: string;
	duration?: number;
	/** 匹配的分支 ID（null 表示走 ELSE） */
	matchedCaseId?: string | null;
	inputs?: Record<string, unknown>;
	error?: string;
}

/** IF 条件分支节点数据 */
export interface IfNodeData extends Record<string, unknown> {
	title: string;
	type: 'if';
	desc?: string;
	
	/** 条件分支列表（IF + ELIF） */
	cases: ConditionCase[];
	
	/** 上次运行结果 */
	lastRun?: IfRunResult;
}

/** IF 条件分支节点类型 */
export type IfNode = Node<IfNodeData, 'if'>;

/** 比较操作符选项 */
export const COMPARISON_OPERATORS: { value: ComparisonOperator; label: string }[] = [
	{ value: 'contains', label: '包含' },
	{ value: 'not_contains', label: '不包含' },
	{ value: 'starts_with', label: '开头是' },
	{ value: 'ends_with', label: '结尾是' },
	{ value: 'equals', label: '是' },
	{ value: 'not_equals', label: '不是' },
	{ value: 'is_empty', label: '为空' },
	{ value: 'is_not_empty', label: '不为空' },
];

/** 不需要值的操作符 */
export const NO_VALUE_OPERATORS: ComparisonOperator[] = ['is_empty', 'is_not_empty'];

/** 创建默认条件 */
export function createDefaultCondition(): Condition {
	return {
		id: crypto.randomUUID(),
		variable: '',
		operator: 'contains',
		value: ''
	};
}

/** 创建默认分支 */
export function createDefaultCase(type: 'if' | 'elif'): ConditionCase {
	return {
		id: crypto.randomUUID(),
		type,
		conditions: [],
		logicalOperator: 'and'
	};
}
