/**
 * IF 条件分支节点执行器
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import { VariableResolver } from '$lib/components/workflow/engine/variable-resolver';
import type { IfNodeData, ConditionCase, Condition, ComparisonOperator } from './types';

export class IfNodeExecutor implements NodeExecutor {
	async execute(
		node: WorkflowNode<IfNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data;
		const cases = data.cases;

		if (!cases || cases.length === 0) {
			return { branch: 'else', branchIndex: -1 };
		}

		const resolver = new VariableResolver(context);

		for (let i = 0; i < cases.length; i++) {
			const caseItem = cases[i];

			if (caseItem.type === 'else') {
				return { branch: 'else', branchIndex: i };
			}

			if (this.evaluateCase(caseItem, resolver)) {
				return { branch: caseItem.id, branchIndex: i };
			}
		}

		return { branch: 'none', branchIndex: -1 };
	}

	private evaluateCase(caseItem: ConditionCase, resolver: VariableResolver): boolean {
		const { conditions, logicalOperator } = caseItem;
		if (conditions.length === 0) return false;

		const results = conditions.map(c => this.evaluateCondition(c, resolver));
		return logicalOperator === 'and' ? results.every(r => r) : results.some(r => r);
	}

	private evaluateCondition(condition: Condition, resolver: VariableResolver): boolean {
		const { variable, operator, value } = condition;
		const actualValue = resolver.resolve(variable);

		switch (operator) {
			case 'equals': return String(actualValue) === value;
			case 'not_equals': return String(actualValue) !== value;
			case 'contains': return String(actualValue).includes(value ?? '');
			case 'not_contains': return !String(actualValue).includes(value ?? '');
			case 'starts_with': return String(actualValue).startsWith(value ?? '');
			case 'ends_with': return String(actualValue).endsWith(value ?? '');
			case 'greater_than': return Number(actualValue) > Number(value);
			case 'less_than': return Number(actualValue) < Number(value);
			case 'greater_than_or_equal': return Number(actualValue) >= Number(value);
			case 'less_than_or_equal': return Number(actualValue) <= Number(value);
			case 'is_empty': return actualValue === undefined || actualValue === null || actualValue === '';
			case 'is_not_empty': return actualValue !== undefined && actualValue !== null && actualValue !== '';
			default: return false;
		}
	}
}
