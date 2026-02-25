/**
 * IF 条件分支节点执行器
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';
import { VariableResolver } from '../variable-resolver';

/** 条件操作符 */
type ComparisonOperator = 
	| 'equals' 
	| 'not_equals' 
	| 'contains' 
	| 'not_contains'
	| 'starts_with'
	| 'ends_with'
	| 'greater_than'
	| 'less_than'
	| 'greater_than_or_equal'
	| 'less_than_or_equal'
	| 'is_empty'
	| 'is_not_empty';

/** 条件定义 */
interface Condition {
	variable: string;
	operator: ComparisonOperator;
	value?: string;
}

/** 条件分支 */
interface ConditionCase {
	id: string;
	type: 'if' | 'elif' | 'else';
	conditions: Condition[];
	logicalOperator: 'and' | 'or';
}

export class IfNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<BaseNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data as Record<string, unknown>;
		const cases = data.cases as ConditionCase[] | undefined;

		if (!cases || cases.length === 0) {
			return { branch: 'else', branchIndex: -1 };
		}

		const resolver = new VariableResolver(context);

		// 评估每个分支
		for (let i = 0; i < cases.length; i++) {
			const caseItem = cases[i];

			// else 分支总是匹配
			if (caseItem.type === 'else') {
				return { branch: 'else', branchIndex: i };
			}

			// 评估条件
			const result = this.evaluateCase(caseItem, resolver);
			if (result) {
				return { branch: caseItem.id, branchIndex: i };
			}
		}

		// 没有匹配的分支
		return { branch: 'none', branchIndex: -1 };
	}

	private evaluateCase(caseItem: ConditionCase, resolver: VariableResolver): boolean {
		const { conditions, logicalOperator } = caseItem;

		if (conditions.length === 0) return false;

		const results = conditions.map(c => this.evaluateCondition(c, resolver));

		if (logicalOperator === 'and') {
			return results.every(r => r);
		} else {
			return results.some(r => r);
		}
	}

	private evaluateCondition(condition: Condition, resolver: VariableResolver): boolean {
		const { variable, operator, value } = condition;
		const actualValue = resolver.resolve(variable);

		switch (operator) {
			case 'equals':
				return String(actualValue) === value;
			
			case 'not_equals':
				return String(actualValue) !== value;
			
			case 'contains':
				return String(actualValue).includes(value ?? '');
			
			case 'not_contains':
				return !String(actualValue).includes(value ?? '');
			
			case 'starts_with':
				return String(actualValue).startsWith(value ?? '');
			
			case 'ends_with':
				return String(actualValue).endsWith(value ?? '');
			
			case 'greater_than':
				return Number(actualValue) > Number(value);
			
			case 'less_than':
				return Number(actualValue) < Number(value);
			
			case 'greater_than_or_equal':
				return Number(actualValue) >= Number(value);
			
			case 'less_than_or_equal':
				return Number(actualValue) <= Number(value);
			
			case 'is_empty':
				return actualValue === undefined || actualValue === null || actualValue === '';
			
			case 'is_not_empty':
				return actualValue !== undefined && actualValue !== null && actualValue !== '';
			
			default:
				return false;
		}
	}
}
