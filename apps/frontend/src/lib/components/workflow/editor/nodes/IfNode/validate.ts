/**
 * IfNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { IfNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as IfNodeData;

	// 检查是否有条件分支
	if (!nodeData.cases || nodeData.cases.length === 0) {
		issues.push({
			id: `${nodeId}-no-cases`,
			severity: 'error',
			message: '未配置条件分支',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'cases',
		});
	} else {
		// 检查每个分支是否有条件
		nodeData.cases.forEach((c, index) => {
			if (!c.conditions || c.conditions.length === 0) {
				issues.push({
					id: `${nodeId}-case-${c.id}-no-conditions`,
					severity: 'error',
					message: `分支 ${index + 1} 未配置条件`,
					nodeId,
					nodeTitle,
					nodeType,
					field: `cases[${index}].conditions`,
				});
			} else {
				// 检查条件是否完整
				c.conditions.forEach((cond, condIndex) => {
					if (!cond.variable?.trim()) {
						issues.push({
							id: `${nodeId}-case-${c.id}-cond-${cond.id}-no-var`,
							severity: 'error',
							message: `分支 ${index + 1} 条件 ${condIndex + 1} 未选择变量`,
							nodeId,
							nodeTitle,
							nodeType,
							field: `cases[${index}].conditions[${condIndex}].variable`,
						});
					}
				});
			}
		});
	}

	// 检查是否有输入连接
	const hasIncomingEdge = context.edges.some(e => e.target === nodeId);
	if (!hasIncomingEdge) {
		issues.push({
			id: `${nodeId}-no-input`,
			severity: 'warning',
			message: '节点没有输入连接',
			nodeId,
			nodeTitle,
			nodeType,
		});
	}

	return issues;
}
